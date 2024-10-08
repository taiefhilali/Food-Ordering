import { useEffect, useState } from 'react';
import axios from 'axios';
import { Restaurant, Feedback, Reply } from '@/types';
import DefaultLayout from '@/layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import Swal from 'sweetalert2';
import Modal from 'react-modal';
import './feeback.css';

const RestaurantTable = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [adminReplyText, setAdminReplyText] = useState<{ [key: string]: string }>({});
  const [showReplyForm, setShowReplyForm] = useState<{ [key: string]: boolean }>({});



  const handleReplyChange = (feedbackId: string, value: string) => {
    setAdminReplyText(prevState => ({
      ...prevState,
      [feedbackId]: value,
    }));
  };

  const handleAdminReply = async (feedbackId: string) => {
    try {
      const token = localStorage.getItem('userToken');
      const userId = localStorage.getItem('userId'); // Get the user ID from local storage
      const replyText = adminReplyText[feedbackId];

      if (!replyText) {
        return; // Do not send empty replies
      }

      await axios.post(
        `http://localhost:7000/api/my/feedback/${feedbackId}/reply`,
        {
          replyText: replyText,
          createdAt: new Date(), // Include the current date in the request payload
          user: userId, // Include the user ID in the request payload
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // After successfully posting the reply, re-fetch feedbacks
      if (selectedRestaurantId) {
        const response = await axios.get(`http://localhost:7000/api/my/feedback/${selectedRestaurantId}`);
        setFeedbacks(response.data);
      }

      // Clear the reply text and close the form
      setAdminReplyText(prevState => ({
        ...prevState,
        [feedbackId]: '',
      }));
      setShowReplyForm(prevState => ({
        ...prevState,
        [feedbackId]: false,
      }));

      Swal.fire('Success!', 'Your reply has been submitted.', 'success');
    } catch (error) {
      console.error('Error sending reply:', error);
      Swal.fire('Error!', 'There was an error submitting your reply.', 'error');
    }
  };


  const handleDeleteReply = async (replyId: string, feedbackId: string) => {
    try {
      const token = localStorage.getItem('userToken');

      if (!token) {
        throw new Error('No token found');
      }

      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f2ab48',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:7000/api/my/feedback/${feedbackId}/reply/${replyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Remove the deleted reply from the state
        const updatedFeedbacks = feedbacks.map(feedback =>
          feedback._id === feedbackId
            ? {
              ...feedback,

              replies: feedback.replies?.filter(reply => reply._id !== replyId) || [], // Use optional chaining and fallback to empty array
            }
            : feedback
        );
        setFeedbacks(updatedFeedbacks);

        Swal.fire('Deleted!', 'Your reply has been deleted.', 'success');
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
      Swal.fire('Error!', 'There was an error deleting the reply.', 'error');
    }
  };

  const toggleReplyForm = (feedbackId: string) => {
    setShowReplyForm(prevState => ({
      ...prevState,
      [feedbackId]: !prevState[feedbackId],
    }));
  };

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('userToken');

        if (!userId || !token) {
          throw new Error('No userId or token found');
        }

        const response = await axios.get('http://localhost:7000/api/my/restaurant/restaurants', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data) {
          throw new Error('Failed to get restaurants');
        }

        const fetchedRestaurants: Restaurant[] = response.data;
        setRestaurants(fetchedRestaurants);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        setError('Failed to fetch restaurants data. Please check the console for more details.');
      }
    };

    fetchRestaurants();
  }, []);

  const toggleApproval = async (id: string) => {
    try {
      const token = localStorage.getItem('userToken');

      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.patch(`http://localhost:7000/api/my/restaurant/${id}/toggle-approval`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data) {
        throw new Error('Failed to toggle approval status');
      }

      const updatedRestaurants = restaurants.map((restaurant) =>
        restaurant._id === id ? { ...restaurant, isApproved: !restaurant.isApproved } : restaurant
      );
      setRestaurants(updatedRestaurants);
    } catch (error) {
      console.error('Error toggling approval status:', error);
      setError('Failed to toggle approval status. Please check the console for more details.');
    }
  };

  const handleDelete = async (restaurantId: string) => {
    try {
      const token = localStorage.getItem('userToken');

      if (!token) {
        throw new Error('No token found');
      }

      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f2ab48',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:7000/api/restaurant/${restaurantId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const updatedRestaurants = restaurants.filter(restaurant => restaurant._id !== restaurantId);
        setRestaurants(updatedRestaurants);

        Swal.fire('Deleted!', 'Your restaurant has been deleted.', 'success');
      }
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      Swal.fire('Error!', 'There was an error deleting your restaurant.', 'error');
    }
  };

  const openFeedbackModal = async (restaurantId: string) => {
    setSelectedRestaurantId(restaurantId);
    setIsModalOpen(true);
    try {
      const response = await axios.get(`http://localhost:7000/api/my/feedback/${restaurantId}`);
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setError('Failed to fetch feedbacks.');
    }
  };

  const closeFeedbackModal = () => {
    setIsModalOpen(false);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Display Restaurants" />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Restaurant Details</h4>
        <div className="flex flex-col">
          <div className="grid grid-cols-2 rounded-sm bg-gray-200 dark:bg-meta-4 sm:grid-cols-6 gap-1">
            <div className="p-1 xl:p-2">
              <h5 className="text-xs font-medium uppercase xsm:text-sm">Name</h5>
            </div>
            <div className="hidden p-1 text-center sm:block xl:p-2">
              <h5 className="text-xs font-medium uppercase xsm:text-sm">Cuisines</h5>
            </div>
            <div className="hidden p-1 text-center sm:block xl:p-2">
              <h5 className="text-xs font-medium uppercase xsm:text-sm">Rating</h5>
            </div>
            <div className="hidden p-1 text-center sm:block xl:p-2">
              <h5 className="text-xs font-medium uppercase xsm:text-sm">Approving</h5>
            </div>
            <div className="hidden p-1 text-center sm:block xl:p-2">
              <h5 className="text-xs font-medium uppercase xsm:text-sm">Feedbacks</h5>
            </div>
            <div className="hidden p-1 text-center sm:block xl:p-2">
              <h5 className="text-xs font-medium uppercase xsm:text-sm">Remove</h5>
            </div>
          </div>

          {restaurants.map((restaurant, index) => (
            <div
              key={restaurant._id}
              className={`grid grid-cols-2 sm:grid-cols-6 ${index === restaurants.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'}`}
            >
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <div className="flex-shrink-0">
                  <img
                    src={restaurant.imageUrl}
                    alt="Restaurant"
                    className="w-14 h-14 rounded-full border-2 border-gray-300"
                  />
                </div>
                <p className="text-black dark:text-white sm:block">{restaurant.restaurantName}</p>
              </div>
              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                <div className="text-black dark:text-white">
                  {restaurant.cuisines.map((cuisine, i) => (
                    <div key={i} className="flex items-center text-sm">
                      <span>{cuisine}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                <p className="text-meta-10">{restaurant.ratingCount}</p>
              </div>
              <div className="flex items-center justify-center p-2.5 sm:flex xl:p-5">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={restaurant.isApproved}
                    onChange={() => toggleApproval(restaurant._id)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="flex items-center justify-center p-2.5 sm:flex xl:p-5">
                <button onClick={() => openFeedbackModal(restaurant._id)} className="text-orange-500">
                  💬
                </button>
              </div>
              <div className="flex items-center justify-center p-2.5 sm:flex xl:p-5">
                <button onClick={() => handleDelete(restaurant._id)}>X</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedRestaurantId && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeFeedbackModal}
          ariaHideApp={false}
          style={{
            content: {
              width: '50%',
              height: '70%',
              margin: '90px auto',
              padding: '20px',
              borderRadius: '10px',
              overflowY: 'auto',
              position: 'relative',
              right: '10%',
            },
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
          }}
        >
          <div className="feedback-container">
            {feedbacks.length > 0 ? (
              feedbacks.map(feedback => (
                <div key={feedback._id} className="feedback-item">
                  <div className="feedback-header">
                    <img
                      src={feedback.userId.imageUrl}
                      alt={`${feedback.userId.username}'s profile`}
                      className="user-image-circle"
                    />

                    <div className="user-info">
                      <strong>{feedback.userId.username}</strong>
                      <span className="feedback-time">{new Date(feedback.createdAt).toLocaleString()}</span>
                    </div>

                    <div className="feedback-text">
                      <p>{feedback.feedbackText}</p>
                    </div>
                  </div>

                  {feedback.replies && feedback.replies.length > 0 && (
                    <div className="feedback-replies">
                      {feedback.replies.map((reply: Reply) => (
                        <div key={reply._id} className="reply-item">
                          <div className="admin-info">
                            <img
                              src={reply.user?.imageUrl || 'default-image-url'} // Provide a default image if imageUrl is not available
                              alt={reply.user?.username || 'Unknown User'} // Provide a fallback name if username is not available
                              className="admin-image"
                            />
                            <div className="admin-details">
                              <strong className="admin-name">{reply.user?.username || 'Unknown User'}</strong>
                              <span className="reply-time">{new Date(reply.createdAt).toLocaleString()}</span>
                            </div>
                          </div>
                          <p className="reply-text">{reply.replyText}</p>
                          <button onClick={() => handleDeleteReply(reply._id, feedback._id)} className="delete-reply-button">
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  )}



                  {/* Reply Link and Form */}
                  <div className="admin-reply-form">
                    <button
                      onClick={() => toggleReplyForm(feedback._id)}
                      className="reply-toggle-button"
                    >
                      {showReplyForm[feedback._id] ? 'Cancel' : 'Reply'}
                    </button>

                    {showReplyForm[feedback._id] && (
                      <div className="reply-form">
                        <textarea
                          value={adminReplyText[feedback._id] || ''}
                          onChange={(e) => handleReplyChange(feedback._id, e.target.value)}
                          placeholder="Write a reply..."
                          className="reply-input"
                        />
                        <button onClick={() => handleAdminReply(feedback._id)} className="reply-button">
                          Submit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No feedback available</p>
            )}
          </div>

          <button onClick={closeFeedbackModal} className="close-modal-button">
            X
          </button>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default RestaurantTable;
