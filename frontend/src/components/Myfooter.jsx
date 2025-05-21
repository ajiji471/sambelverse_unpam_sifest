import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";

const Myfooter = () => {
  return (
    <>

<footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto flex flex-col items-center">
        <p className="text-sm mb-3">&copy; {new Date().getFullYear()} 
          <a href="#" className="text-white hover:text-blue-400 transition duration-300"> Sambelverse </a>
           Ver.4 by 
           <a href="#" className="text-white hover:text-blue-400 transition duration-300"> Ajiji </a>
           .</p>
        <div className="flex space-x-4">
          <a href="https://github.com/ajiji471" className="text-gray-400 hover:text-white transition duration-300">
            <FaFacebook size={24} />
          </a>
          <a href="https://github.com/ajiji471" className="text-gray-400 hover:text-white transition duration-300">
            <FaTwitter size={24} />
          </a>
          <a href="https://github.com/ajiji471" className="text-gray-400 hover:text-white transition duration-300">
            <FaInstagram size={24} />
          </a>
          <a href="https://github.com/ajiji471" className="text-gray-400 hover:text-white transition duration-300">
            <FaGithub size={24} />
          </a>
        </div>
      </div>
    </footer>  
    </>
    )
}

export default Myfooter