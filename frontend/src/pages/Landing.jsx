import React from 'react';
import { Link } from 'react-router-dom';
import { FaWifi, FaConciergeBell, FaSwimmingPool, FaStar, FaArrowRight } from 'react-icons/fa';

const Landing = () => {
  const amenities = [
    { 
      icon: <FaWifi className="text-4xl text-secondary" />, 
      title: 'High-Speed WiFi', 
      description: 'Seamless connectivity across all areas' 
    },
    { 
      icon: <FaConciergeBell className="text-4xl text-secondary" />, 
      title: '24/7 Concierge', 
      description: 'Personalized service at your fingertips' 
    },
    { 
      icon: <FaSwimmingPool className="text-4xl text-secondary" />, 
      title: 'Premium Spa', 
      description: 'Unwind in luxury and tranquility' 
    },
    { 
      icon: <FaStar className="text-4xl text-secondary" />, 
      title: '5-Star Dining', 
      description: 'Michelin-star cuisine experiences' 
    }
  ];

  const roomCategories = [
    { 
      type: 'Deluxe Room', 
      price: '₹5,999/night', 
      image: '✨',
      features: ['King Bed', 'City View', '45 sq.m']
    },
    { 
      type: 'Premium Suite', 
      price: '₹9,999/night', 
      image: '👑',
      features: ['Living Area', 'Balcony', '75 sq.m']
    },
    { 
      type: 'Presidential Suite', 
      price: '₹19,999/night', 
      image: '🏆',
      features: ['3 Rooms', 'Panoramic View', '150 sq.m']
    },
    { 
      type: 'Ocean View Suite', 
      price: '₹14,999/night', 
      image: '🌊',
      features: ['Beach Access', 'Jacuzzi', '100 sq.m']
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section - Premium Design */}
      <section className="min-h-screen bg-gradient-to-br from-primary via-dark to-secondary text-white flex items-center relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary bg-opacity-10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white bg-opacity-5 rounded-full blur-3xl -ml-48 -mb-48"></div>

        <div className="max-w-6xl mx-auto px-4 py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fadeIn">
              <div className="inline-block px-4 py-2 bg-secondary bg-opacity-20 rounded-full border border-secondary">
                <p className="text-secondary font-semibold text-sm">✨ LUXURY HOSPITALITY</p>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                Indulge in <span className="text-secondary">Pure Luxury</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 font-light">
                Experience world-class hospitality at our award-winning resort. Every moment crafted to perfection.
              </p>
              
              <div className="flex gap-4 pt-6 flex-wrap">
                <Link to="/rooms" className="inline-flex items-center gap-2 bg-secondary text-dark font-bold py-4 px-8 rounded-lg hover:bg-opacity-90 transition-all hover:scale-105">
                  Explore Rooms <FaArrowRight />
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white hover:text-primary transition-all">
                  Contact Us
                </Link>
              </div>

              <div className="flex gap-8 pt-6 text-sm">
                <div>
                  <p className="text-secondary font-bold text-2xl">500+</p>
                  <p className="text-gray-300">Luxury Rooms</p>
                </div>
                <div>
                  <p className="text-secondary font-bold text-2xl">4.9★</p>
                  <p className="text-gray-300">Guest Rating</p>
                </div>
                <div>
                  <p className="text-secondary font-bold text-2xl">25+</p>
                  <p className="text-gray-300">Years Legacy</p>
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary rounded-2xl blur-2xl opacity-50 -z-10 scale-110"></div>
                <div className="text-9xl text-center">🏨</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-20 px-4 bg-light">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">World-Class Amenities</h2>
            <p className="text-xl text-gray-600">Immerse yourself in unparalleled comfort and service</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {amenities.map((amenity, index) => (
              <div 
                key={index} 
                className="group bg-white p-8 rounded-2xl card-shadow hover:shadow-2xl transition-all hover:-translate-y-2 duration-300"
              >
                <div className="mb-6 inline-block p-4 bg-secondary bg-opacity-10 rounded-xl group-hover:bg-secondary group-hover:bg-opacity-20 transition">
                  {amenity.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-dark">{amenity.title}</h3>
                <p className="text-gray-600 leading-relaxed">{amenity.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Room Categories Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Curated Room Collection</h2>
            <p className="text-xl text-gray-600">Choose from our exquisite selection of accommodations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roomCategories.map((room, index) => (
              <Link 
                key={index} 
                to="/rooms"
                className="group bg-white rounded-2xl card-shadow overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-4 duration-300"
              >
                <div className="relative h-56 bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden">
                  <div className="text-8xl group-hover:scale-110 transition-transform duration-300">
                    {room.image}
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all"></div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-dark mb-2 group-hover:text-primary transition">
                    {room.type}
                  </h3>
                  <p className="text-secondary font-bold text-lg mb-4">{room.price}</p>
                  
                  <div className="space-y-2 mb-4">
                    {room.features.map((feature, idx) => (
                      <p key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="text-secondary">•</span> {feature}
                      </p>
                    ))}
                  </div>
                  
                  <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold group-hover:bg-secondary transition">
                    View Details →
                  </button>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/rooms" 
              className="inline-flex items-center gap-2 text-primary font-bold text-lg hover:text-secondary transition"
            >
              Explore All Rooms <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-dark to-primary text-white rounded-3xl mx-4 my-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Award-Winning Excellence</h2>
          <p className="text-xl text-gray-200 mb-8">
            Recognized globally for outstanding service, innovative design, and unforgettable guest experiences. 
            Join thousands of satisfied guests who've chosen our resort as their perfect escape.
          </p>
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-2 bg-white bg-opacity-10 px-6 py-3 rounded-lg">
              <FaStar className="text-secondary text-2xl" />
              <span>5-Star Rated</span>
            </div>
            <div className="flex items-center gap-2 bg-white bg-opacity-10 px-6 py-3 rounded-lg">
              <FaStar className="text-secondary text-2xl" />
              <span>2024 Excellence Award</span>
            </div>
            <div className="flex items-center gap-2 bg-white bg-opacity-10 px-6 py-3 rounded-lg">
              <FaStar className="text-secondary text-2xl" />
              <span>Best Luxury Destination</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">Ready for Your Perfect Getaway?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Book your dream stay today and enjoy exclusive benefits and special offers
          </p>
          <Link 
            to="/rooms" 
            className="inline-block bg-secondary text-dark font-bold py-4 px-10 rounded-lg hover:shadow-2xl transition-all hover:scale-105 text-lg"
          >
            Start Booking Now →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">🏨 Luxury Resort</h3>
              <p className="text-gray-400 leading-relaxed">Your ultimate destination for world-class hospitality and unforgettable moments.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link to="/rooms" className="text-gray-400 hover:text-secondary transition">Rooms</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-secondary transition">Contact</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-secondary transition">Login</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Services</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-secondary transition">Dining</a></li>
                <li><a href="#" className="text-gray-400 hover:text-secondary transition">Spa & Wellness</a></li>
                <li><a href="#" className="text-gray-400 hover:text-secondary transition">Events</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <p className="text-gray-400 mb-2">📍 123 Resort Lane, Paradise City</p>
              <p className="text-gray-400 mb-2">📞 +1 (555) 123-4567</p>
              <p className="text-gray-400">📧 reservations@luxuryresort.com</p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 Luxury Resort. All rights reserved. | Privacy Policy | Terms & Conditions</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
