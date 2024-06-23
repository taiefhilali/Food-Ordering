import hero from "../assets/hero1.png"

export default function Hero() {
    return (
        <div className="relative h-[600px] overflow-hidden">
        <img
          src={hero}
          className="absolute inset-0 w-full h-full object-cover rounded-full transform translate-y-1/4"
          alt="Hero Image"
        />
      </div>
          

    )
}
