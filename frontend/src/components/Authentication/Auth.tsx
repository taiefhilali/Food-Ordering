import React, { useState, useEffect } from 'react';
import { useSession, useUser } from '@clerk/clerk-react';

function Auth() {
  const { session } = useSession();
  const { user } = useUser();

  if (session) {

    
    const userId = session.user.id;
    console.log('User ID!!:', userId);

    
  }

  useEffect(() => {
    const sendUserDataToMongoDB = async () => {
      try {
        if (!user) {
          console.error('User object is null or undefined.');
          return;
        }

        // Access email through the primary email address
        const email = user.primaryEmailAddress?.emailAddress;

        if (!email) {
          console.error('Email is missing from user data.');
          return;
        }
        const firstname = user.firstName;
        const lastname = user.lastName;

        // Extract other necessary fields from the user object
        const { id, imageUrl } = user;

        const userData = {
          id,
          email,
          firstname,
          lastname,
          imageUrl,
        };

        const response = await fetch('http://localhost:7000/api/my/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (response.ok) {
          console.log('User data sent to MongoDB successfully.');
        } else {
          console.error('Failed to send user data to MongoDB.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Call the function when the component mounts
    sendUserDataToMongoDB();
  }, [user]); // Add user as a dependency so that the effect runs when the user object changes

  // Check if the session and user are available
  if (session && session.user) {
    const user = session.user;

    // Access user properties
    const userId = user.id;
    const username = user.username;
    const email = user.emailAddresses[0].emailAddress; // Assuming the user has at least one email address

    // Render user information
    return (
      <div>
        <h1>{username}</h1>
        {/* Additional UI elements based on user information */}
      </div>
    );
  }

  // If no user is available, render a loading or login message
  return<>       
  </>
  
}

export default Auth;
