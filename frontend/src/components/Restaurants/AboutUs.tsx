import './restauranthome.css';
import Logo from '../../assets/img/saldsss.png';

const AboutUs = () => {
    return (
        <div className="about-us-container">
            <div className="circle-container mr-96 ">
                <div className="inner-circle "></div>
                <img src={Logo} style={{ marginLeft: '-0.5cm' }} alt="Logo" />

            </div>
            <div className="about-us-text">
                <h2 className='font-bold'>About Us</h2>
                <p>
                    Welcome to our restaurant! Our mission is to provide delicious, high-quality meals in a friendly and welcoming atmosphere.
                    Our menu features a wide variety of dishes made from the freshest ingredients, ensuring that there's something for everyone.
                    Whether you're looking for a quick bite or a leisurely meal, we strive to make every dining experience memorable. Thank you
                    for choosing us, and we look forward to serving you!
                </p>
            </div>
        </div>
    );
};

export default AboutUs;
