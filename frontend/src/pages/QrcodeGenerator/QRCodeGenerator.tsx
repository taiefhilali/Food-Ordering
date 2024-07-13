import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import QRCode from 'react-qr-code';
import DefaultLayout from '@/layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import Select, { GroupBase } from 'react-select';
import { Controller, useForm } from 'react-hook-form';

type Restaurant = {
  _id: string;
  restaurantName: string;
  imageUrl: string;
};

const QRCodeGenerator = () => {
  const { control, handleSubmit } = useForm();
  const [qrCodePath, setQRCodePath] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null); // Define selectedRestaurant as Restaurant | null

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) {
          throw new Error('No token found');
        }
        const userId = localStorage.getItem('userId');

        const response = await axios.get('http://localhost:7000/api/my/restaurant', {
          params: { userId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRestaurants(response.data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchData();
  }, []);

  const generateQRCode = async () => {
    try {
      if (!selectedRestaurant) return; // Handle case where selectedRestaurant is null

      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`http://localhost:7000/api/my/table/generate-qr-code`, {
        params: {
          restaurantName: selectedRestaurant.restaurantName,
          tableNumber,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.filePath) {
        setQRCodePath(response.data.filePath);
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const downloadQRCode = async () => {
    try {
      if (!selectedRestaurant || !qrCodePath) return; // Handle case where selectedRestaurant or qrCodePath is null

      const response = await axios.get(`http://localhost:7000/api/my/table/generate-qr-code`, {
        params: {
          restaurantName: selectedRestaurant.restaurantName,
          tableNumber,
        },
        responseType: 'blob' // Set response type to blob for binary data
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `QRCode-${selectedRestaurant.restaurantName}.png`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link); // Clean up
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  const customStyles = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: (provided: any) => ({
      ...provided,
      borderRadius: '9999px', // Rounded full
      padding: '4px',
      borderColor: '#d1d5db', // Tailwind gray-300
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#fb923c', // Tailwind orange-500
      },
      width: '200%'
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    menu: (provided: any) => ({
      ...provided,
      borderRadius: '0.5rem', // Tailwind rounded-lg
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    option: (provided: any, state: { isFocused: any; }) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 12px',
      backgroundColor: state.isFocused ? '#fb923c' : 'white', // Tailwind orange-500 for focused state
      color: state.isFocused ? 'white' : 'black',
      '&:active': {
        backgroundColor: '#fb923c',
        color: 'white',
      },
    }),
  };

  const formatOptionLabel = ({ restaurantName, imageUrl }: Restaurant) => (
    <div className="flex justify-between items-center">
      <span>{restaurantName}</span>
      <img
        src={imageUrl}
        alt={restaurantName}
        className="w-8 h-8 rounded-full ml-2"
      />
    </div>
  );

  return (
    <DefaultLayout>
      <Breadcrumb pageName='QrCode Generator' />
      <Container>
        <Row className="mt-5 mr-40 align-bottom">
          <Col>
            <Form className='mr-28'>
                <Controller
                  name="restaurant"
                  rules={{ required: true }}
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={restaurants}
                      getOptionLabel={(restaurant) => restaurant.restaurantName}
                      getOptionValue={(restaurant) => restaurant._id}
                      formatOptionLabel={formatOptionLabel}
                      styles={customStyles}
                      placeholder="Select Restaurant"
                      onChange={(selected) => {
                        setSelectedRestaurant(selected);
                        field.onChange(selected);
                      }}
                    />
                  )}
                />
              <Form.Group controlId="tableNumber">
                <Form.Label>Table Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your table number"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  style={{ borderRadius: '50px', width: '200%' }} // Rounded and full-width style
                />
              </Form.Group>
              <Row className="mt-5 justify-content-center">
                <Button
                  variant="warning"
                  onClick={handleSubmit(generateQRCode)}
                  style={{ backgroundColor: 'orange', borderColor: 'orange', borderRadius: '50px', width: '200%' }}
                >
                  Generate QR Code
                </Button>
              </Row>
            </Form>
          </Col>
        </Row>
        {qrCodePath && (
          <div className="text-center mt-4 ml-50">
            <h4>Generated QR Code</h4>
            <QRCode value={qrCodePath} />
            <Button
              variant="success"
              className="mt-3"
              onClick={downloadQRCode}
              style={{ width: '200%', borderRadius: '50px' }}
            >
              Download QR Code
            </Button>
          </div>
        )}
      </Container>
    </DefaultLayout>
  );
};

export default QRCodeGenerator;
