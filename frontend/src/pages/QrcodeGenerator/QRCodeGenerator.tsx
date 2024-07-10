import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import QRCode from 'react-qr-code';
import DefaultLayout from '@/layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';

const QRCodeGenerator = () => {
  const [restaurantName, setRestaurantName] = useState('');
  const [qrCodePath, setQRCodePath] = useState('');
  const [tableNumber, setTableNumber] = useState('');

  const generateQRCode = async () => {
    try {
      const response = await axios.get(`http://localhost:7000/api/my/table/generate-qr-code`, {
        params: {
          restaurantName,
          tableNumber
        }
      });

      if (response.data.filePath) {
        setQRCodePath(response.data.filePath);
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const downloadQRCode = () => {
    // Download QR code image as PNG
    const link = document.createElement('a');
    link.href = qrCodePath;
    link.download = `QRCode-${restaurantName}.png`;
    link.click();
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName='QrCode Generator' />
      <Container>
      <Row className="mt-15">
          <Col md={{ span: 6, offset: 3 }}>
            <Form>
              <Form.Group controlId="restaurantName">
                <Form.Label>Restaurant Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter restaurant name"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  style={{ borderRadius: '50px', width: '200%' }} // Rounded and full-width style
                />
              </Form.Group>
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
             
            </Form>
            <Row className="mt-15">

             <Button  variant="warning" onClick={generateQRCode} style={{ backgroundColor: 'orange', borderColor: 'orange' , borderRadius: '50px', width: '200%' }}>
                Generate QR Code
              </Button>
              </Row>
          </Col>
        </Row>  
        {qrCodePath && (
          <Row className="mt-6 ml-80 ">
            <Col md={{ span: 6, offset: 3 }} className="text-center">
              <h2>Generated QR Code</h2>
              <QRCode value={qrCodePath} />
              <Button variant="success" className="mt-3" onClick={downloadQRCode}>
                Download QR Code
              </Button>
            </Col>
          </Row>
        )}
     </Container> 
    </DefaultLayout>
  );
};

export default QRCodeGenerator;
