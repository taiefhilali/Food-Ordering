
import '../assets/css/header.css'
export default function HomePage() {
    return (

        <div className='flex flex-col gap-12'>
            {/* <section><LoginFormModal></LoginFormModal></section> */}
            <div className='bg-white rounded-lg shadow-md py-20 flex flex-col gap-2 text-center -mt-16'>
                <h1 className='text-5xl font-bold tracking-tight text-orange-500'> Order Your Favourite Food Here</h1>

                <div className="header-contents">

                    <p>
                        Choose from a diverse menu featuring a delectable array of dishes
                        crafted with the finest ingredients and culinary expertise. Our
                        mission is to satisfy your cravings and elevate your dining
                        experience, one delicious meal at a time.
                    </p>

                    <div className="menu-button-container">
                        <a href="#explore-menu" className="menu-button-link">
                            <button className="menu-button">View Menu</button>
                        </a>
                    </div>


                </div> </div>
        </div>




    )
}
