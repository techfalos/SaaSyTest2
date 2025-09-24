import React from 'react';

interface GeneratedContactInformationViewProps {
  isContainer?: boolean;
}

export default function GeneratedContactInformationView({ isContainer = false }: GeneratedContactInformationViewProps){
  const useCard = false;
  return (
      <div className="rtext-content" dangerouslySetInnerHTML={{__html: "<section class=\"contact-section\">\n    <h1>Contact Vitalisona: Your Path to Healing Sound</h1>\n    \n    <div class=\"contact-details\">\n        <h2>Connect with Our Wellness Experts</h2>\n        \n        <div class=\"contact-info\">\n            <h3>Contact Information</h3>\n            <p><strong>Phone:</strong> (877) SOUND-VT</p>\n            <p><strong>Email:</strong> healing@vitalisona.com</p>\n            <p><strong>Physical Address:</strong> 1245 Resonance Way, Harmonic Springs, CA 94122</p>\n        </div>\n\n        <div class=\"business-hours\">\n            <h3>Our Hours of Operation</h3>\n            <p>Monday - Friday: 9:00 AM - 7:00 PM PST</p>\n            <p>Saturday: 10:00 AM - 4:00 PM PST</p>\n            <p>Sunday: Closed</p>\n        </div>\n\n        <div class=\"emergency-contact\">\n            <h3>Emergency Support</h3>\n            <p><strong>Emergency Helpline:</strong> (888) HEAL-NOW</p>\n            <p>Response Time: Within 2 hours for urgent wellness inquiries</p>\n            <p>Immediate support available for acute sound therapy emergencies</p>\n        </div>\n\n        <div class=\"directions\">\n            <h3>Directions to Vitalisona Wellness Center</h3>\n            <p>Located in the heart of Harmonic Springs, our center is easily accessible from major highways. Free parking available on-site.</p>\n            <p>Nearest public transit: Harmonic Springs Metro Station - Line 7</p>\n        </div>\n    </div>\n\n    <div class=\"additional-notes\">\n        <h2>Our Commitment to Your Wellness</h2>\n        <p>At Vitalisona, we believe in holistic healing through precise sound vibration techniques. Our expert practitioners are dedicated to providing personalized, compassionate care tailored to your unique wellness journey.</p>\n    </div>\n</section>" }} />
  );
}