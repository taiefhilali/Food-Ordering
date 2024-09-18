import React, { ReactNode } from 'react';
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutUs from "@/components/Restaurants/AboutUs";
import RestaurantDisplayHome from "@/components/Restaurants/RestaurantDisplayHome";
import Footer from "@/components/Footer";

// Define the props for the Layout component
interface LayoutProps {
    children?: ReactNode; // Make sure children are optional
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <Hero />
            <div className="container mx-auto flex-1 py-10">
                {children} {/* Render children here */}
            </div>
            <div className="container mx-auto flex-1 py-10">
                <AboutUs />
            </div>
            <div className="container mx-auto flex-1 py-10">
                <RestaurantDisplayHome />
            </div>
            <Footer />
        </div>
    );
};

export default Layout;
