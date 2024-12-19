import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FaFacebook, 
  FaTwitter, 
  FaYoutube, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt 
} from 'lucide-react';

// Family Member Component
const FamilyMemberCard = ({ name, role, description, images, additionalInfo }) => {
  const [showFullInfo, setShowFullInfo] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const imageTimer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % images.length
      );
    }, 5000);

    return () => clearInterval(imageTimer);
  }, [images]);

  return (
    <div className="family-member-card bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex">
        <div className="w-1/2 p-4">
          <h3 className="text-2xl font-bold text-green-600 mb-4">{name}</h3>
          <p className="text-gray-700 mb-4">{description}</p>
          
          <Button 
            onClick={() => setShowFullInfo(!showFullInfo)}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            {showFullInfo ? 'Read Less' : 'Read More'}
          </Button>

          {showFullInfo && (
            <div className="mt-4 text-gray-600">
              {additionalInfo.map((info, index) => (
                <p key={index} className="mb-2">{info}</p>
              ))}
            </div>
          )}
        </div>
        
        <div className="w-1/2 relative">
          <img 
            src={images[currentImageIndex]} 
            alt={`${name} gallery`}
            className="w-full h-96 object-cover transition-all duration-500"
          />
        </div>
      </div>
    </div>
  );
};

// Gallery Component
const Gallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="gallery-container">
      <h2 className="text-3xl font-bold text-center mb-8 text-green-600">
        Family Memories
      </h2>
      
      <div className="grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div 
            key={index} 
            className="gallery-item cursor-pointer hover:opacity-75 transition"
            onClick={() => setSelectedImage(image)}
          >
            <img 
              src={image} 
              alt={`Gallery image ${index + 1}`} 
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        ))}
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img 
            src={selectedImage} 
            alt="Selected gallery image" 
            className="max-w-full max-h-full"
          />
        </div>
      )}
    </div>
  );
};

// Contact Form Component
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to a backend service
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
  };

  return (
    <div className="contact-form bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-green-600">
        Contact Madeleine Garden
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Name</label>
          <input 
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input 
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Message</label>
          <textarea 
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg"
            rows="4"
            required
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-green-500 hover:bg-green-600 text-white"
        >
          Send Message
        </Button>
      </form>
    </div>
  );
};

// Main App Component
const MadeleineGardenApp = () => {
  const familyMembers = [
    {
      name: 'Binen Gladys',
      role: 'DABI',
      description: 'A beacon of responsibility, passion, and dedication.',
      images: [
        '/imagesMg/Family/f22.jpeg',
        '/imagesMg/Family/f8.jpeg',
        '/imagesMg/Family/f20.jpeg'
      ],
      additionalInfo: [
        'Born on July 11th, 2000, Binen Gladys was Madeleine\'s eldest daughter.',
        'Completed studies at Mount Kenya University in 2022.',
        'A cornerstone in the foundation of Madeleine Garden.'
      ]
    },
    {
      name: 'Dieudonne Unencan',
      role: 'BABI',
      description: 'A man of wisdom, humility, and quiet leadership.',
      images: [
        '/imagesMg/Family/s30.jpeg',
        '/imagesMg/Family/f6.jpeg',
        '/imagesMg/Family/s34.jpeg'
      ],
      additionalInfo: [
        'Mathematics teacher at Lycée de Kigali for over 20 years.',
        'Married to Madeleine since 1999.',
        'A pillar of strength for his family.'
      ]
    }
  ];

  const galleryImages = [
    './assets/images/f9.jpeg',
    './assets/images/r1.png',
    './assets/images/f6.jpeg',
    'imagesMg/Family/e28.jpeg',
    './assets/images/r2.png'
  ];

  return (
    <div className="madeleine-garden-app max-w-6xl mx-auto">
      <header className="bg-green-50 p-4 flex justify-between items-center">
        <img 
          src="/imagesMg/logo/mg1.png" 
          alt="Madeleine Garden Logo" 
          className="h-16"
        />
        <nav className="flex space-x-4">
          <a href="#home" className="text-green-600 hover:text-green-800">Home</a>
          <a href="#family" className="text-green-600 hover:text-green-800">Family</a>
          <a href="#gallery" className="text-green-600 hover:text-green-800">Gallery</a>
          <a href="#contact" className="text-green-600 hover:text-green-800">Contact</a>
        </nav>
      </header>

      <main>
        <section id="family" className="py-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-green-600">
            Our Family Legacy
          </h2>
          {familyMembers.map((member, index) => (
            <FamilyMemberCard 
              key={index}
              {...member}
            />
          ))}
        </section>

        <section id="gallery" className="py-16 bg-gray-100">
          <Gallery images={galleryImages} />
        </section>

        <section id="contact" className="py-16">
          <ContactForm />
        </section>
      </main>

      <footer className="bg-green-800 text-white py-8">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h4 className="text-xl font-bold">Madeleine Garden</h4>
            <p>A place of love, unity, and celebration</p>
          </div>
          
          <div className="flex space-x-4">
            <a href="#" className="hover:text-green-200"><FaFacebook /></a>
            <a href="#" className="hover:text-green-200"><FaTwitter /></a>
            <a href="#" className="hover:text-green-200"><FaYoutube /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MadeleineGardenApp;