import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutUs from "@/components/Restaurants/AboutUs";
import RestaurantDisplayHome from "@/components/Restaurants/RestaurantDisplayHome";
import HomePage from "@/pages/HomePage";

type Props = {
    children: React.ReactNode;
    showHero?: boolean;
};

const Layout = ({ children = false }: Props) => {
    return (
        <div className="flex flex-col min-h-screen">

            <Header />

            <Hero
            />
            <div className="container mx-auto flex-1 py-10"><HomePage />
            </div>
            <div className="container mx-auto flex-1 py-10">
            <AboutUs/>
            </div>

            <div className="container mx-auto flex-1 py-10">
                <RestaurantDisplayHome />
            </div>

          

            <Footer></Footer>
        </div >

    );
};

export default Layout;