
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MatchCard from "./components/MatchCard";

import { supabase } from "./supabase";

import "./App.css";

function App() {

  const [matches, setMatches] = useState([]);

  // Fetch matches and listen for database changes
  useEffect(() => {

    const fetchMatches = async () => {

      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching matches:", error);
      } else {
        setMatches(data);
      }

    };

    // Fetch matches when the app loads
    fetchMatches();

    // Subscribe to Supabase Realtime
    const channel = supabase
      .channel("matches-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "matches"
        },
        (payload) => {
          console.log("Database changed:", payload);
          fetchMatches();
        }
      )
      .subscribe();

    // Remove subscription when component is removed
    return () => {
      supabase.removeChannel(channel);
    };

  }, []);


  // Handle ticket booking
  const handleBooking = async (match, userName, tickets) => {

    const ticketCount = Number(tickets);

    if (!userName.trim()) {
      alert("Please enter your name!");
      return;
    }

    if (!Number.isInteger(ticketCount) || ticketCount <= 0) {
      alert("Please enter a valid number of tickets!");
      return;
    }

    if (ticketCount > match.available_seats) {
      alert("Not enough seats available!");
      return;
    }

    const totalPrice = match.price * ticketCount;

    const remainingSeats = match.available_seats - ticketCount;

    // Update available seats in Supabase
    const { data: updatedMatch, error: updateError } = await supabase
      .from("matches")
      .update({
        available_seats: remainingSeats
      })
      .eq("id", match.id)
      .gte("available_seats", ticketCount)
      .select()
      .maybeSingle();

    if (updateError) {
      console.error("Seat update error:", updateError);
      alert("Booking failed. Please try again.");
      return;
    }

    if (!updatedMatch) {
      alert("Seats are no longer available. Please refresh and try again.");
      return;
    }

    // Insert booking details into bookings table
    const { error: bookingError } = await supabase
      .from("bookings")
      .insert([
        {
          match_id: match.id,
          user_name: userName.trim(),
          match_title: `${match.team1} vs ${match.team2}`,
          tickets: ticketCount,
          total_price: totalPrice
        }
      ]);

    if (bookingError) {

      console.error("Booking error:", bookingError);

      // Restore seats if booking insertion fails
      await supabase
        .from("matches")
        .update({
          available_seats: updatedMatch.available_seats + ticketCount
        })
        .eq("id", match.id);

      alert("Booking failed. Please try again.");
      return;
    }

    // Update displayed matches
    setMatches((previousMatches) =>
      previousMatches.map((item) =>
        item.id === match.id
          ? updatedMatch
          : item
      )
    );

    alert(
      `Booking Successful!\n\n` +
      `Match: ${match.team1} vs ${match.team2}\n` +
      `Tickets: ${ticketCount}\n` +
      `Total Price: ₹${totalPrice}`
    );

  };


  return (

    <div>

      <Navbar />

      <Hero />

      <section id="matches">

        <h1>Upcoming IPL Matches</h1>

        <div className="matches-container">

          {matches.map((match) => (

            <MatchCard
              key={match.id}
              match={match}
              onBook={handleBooking}
            />

          ))}

        </div>

      </section>

      <section id="booking">

        <h2>Book Your IPL Tickets</h2>

        <p>
          Select your favourite match and enjoy the game!
        </p>

      </section>

    </div>

  );

}

export default App;
