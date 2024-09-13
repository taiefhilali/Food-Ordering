import { useEffect, useState } from 'react';
import axios from 'axios';
import { Restaurant, Feedback } from '@/types';
import DefaultLayout from '@/layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import Swal from 'sweetalert2';
import Modal from 'react-modal'; // Ensure that Modal is properly imported
// import FeedbackForm from './FeedbackForm'; // Assuming you have a feedback form component
import './feeback.css'
const RestaurantTable = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const adminName = localStorage.getItem('username');
const adminImageUrl = localStorage.getItem('imageUrl');

// State for holding admin replies
const [adminReplyText, setAdminReplyText] = useState<{ [key: string]: string }>({});

const handleReplyChange = (feedbackId: string, value: string) => {
  setAdminReplyText(prevState => ({
    ...prevState,
    [feedbackId]: value,
  }));
};

const handleAdminReply = async (feedbackId: string) => {
  try {
    const token = localStorage.getItem('userToken');
    const replyText = adminReplyText[feedbackId];

    if (!replyText) {
      return; // Do not send empty replies
    }

    await axios.post(
      `http://localhost:7000/api/my/feedback/${feedbackId}/reply`,
      { replyText },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Optionally, update feedbacks with the new reply without a page reload
    const updatedFeedbacks = feedbacks.map(feedback =>
      feedback._id === feedbackId
        ? { ...feedback, replies: [...(feedback.replies || []), { replyText, createdAt: new Date() }] }
        : feedback
    );
    setFeedbacks(updatedFeedbacks);

    // Clear reply input after sending
    setAdminReplyText(prevState => ({
      ...prevState,
      [feedbackId]: '',
    }));
  } catch (error) {
    console.error('Error sending reply:', error);
  }
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
          <div className="grid grid-cols-3 rounded-sm bg-gray-200 dark:bg-meta-4 sm:grid-cols-5">
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Name</h5>
            </div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Cuisines</h5>
            </div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Rating</h5>
            </div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Approving</h5>
            </div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Remove</h5>
            </div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Feedback</h5>
            </div>
          </div>

          {restaurants.map((restaurant, index) => (
            <div
              key={restaurant._id}
              className={`grid grid-cols-3 sm:grid-cols-5 ${index === restaurants.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'}`}
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
                <button onClick={() => handleDelete(restaurant._id)}>X</button>
              </div>
              <div className="flex items-center justify-center p-2.5 sm:flex xl:p-5">
                <button onClick={() => openFeedbackModal(restaurant._id)} className="text-blue-500">
                  View Feedback
                </button>
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
      margin: '90px auto', // Adjust the vertical margin to move the modal down
      padding: '20px',
      borderRadius: '10px',
      overflowY: 'auto',
      position: 'relative', // Add position relative to control positioning
      right: '10%', // Adjust the right property to move the modal to the right
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
            <strong>{feedback.userId.name}</strong>
            <span className="feedback-time">{new Date(feedback.createdAt).toLocaleString()}</span>
          </div>
          <div className="feedback-text">
            <p>{feedback.feedbackText}</p>
          </div>

          {/* Display replies if available */}
          {feedback.replies && feedback.replies.length > 0 && (
            <div className="feedback-replies">
              {feedback.replies.map(reply => (
                <div key={reply._id} className="reply-item">
                  <div className="admin-info">
                    <img src={adminImageUrl} alt={adminName} className="admin-image" />
                    <div className="admin-details">
                      <strong className="admin-name">{adminName}</strong>
                      <span className="reply-time">{new Date(reply.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="reply-text">{reply.replyText}</p>
                </div>
              ))}
            </div>
          )}

          {/* Admin Reply Form */}
          <div className="admin-reply-form">
            <textarea
              value={adminReplyText[feedback._id] || ''} // Local state for each reply
              onChange={(e) => handleReplyChange(feedback._id, e.target.value)}
              placeholder="Write a reply..."
              className="reply-input"
            />
            <button onClick={() => handleAdminReply(feedback._id)} className="reply-button">
              Reply
            </button>
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
