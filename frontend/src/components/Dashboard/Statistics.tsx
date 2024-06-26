import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'font-awesome/css/font-awesome.min.css';
import './statistics.css'; // Assuming you save the CSS in this file
import DefaultLayout from '@/layouts/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import ApexChart from '../Products/RevenueByDateComponent';

const CardCounter: React.FC<{ icon: string, count: number, label: string, color: string }> = ({ icon, count, label, color }) => (
    <div className="card-counter-wrapper">
        <div className={`card-counter ${color}`}>
            <i className={`fa ${icon}`}></i>
            <span className="count-numbers">{count}</span>
            <span className="count-name">{label}</span>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName='Dashboard Vendor'/>
        <div className="container">
            <div className="card-row">
                <CardCounter icon="fa-utensils" count={12} label="Flowz" color="primary" />
                <CardCounter icon="fa-bowl-food" count={599} label="Instances" color="danger" />
                <CardCounter icon="fa-list" count={6875} label="Data" color="success" />
                <CardCounter icon="fa-cart-shopping" count={35} label="Users" color="info" />
                {/* <CardCounter icon="fa-users" count={35} label="Users" color="info" /> */}

            </div>
        </div>
        <ApexChart></ApexChart>
        </DefaultLayout>
    );
};

export default Dashboard;
