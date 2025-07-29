"use client"
import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { SiThumbtack } from 'react-icons/si';

interface Review {
  id: number;
  name: string;
  rating: number;
  review: string;
  service: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Bonita c",
    rating: 5,
    review: "Joe did an upgrade on my 20+ year old outdated, over crowded electrical panel. He repaired damaged wires inside a 220 watt outlet. This allowed me the use of the outlet for my new A/c unit. He explained everything from beginning to end on what needed to be done. His prices were very reasonable and he went way and beyond to diagnosis the problems. Joe not only gave a free estimate but was friendly and outgoing. Joe gets 5 stars from me and I would 100% use him again. Thank you Joe",
    service: "Residential Electrical Services"
  },
  {
    id: 2,
    name: "Pradip S",
    rating: 5,
    review: "Had Joe install a Tesla Wall Charger, 50 amp outlet, light, and switch. Super clean job, fast, and professional. Everything works perfectly. Highly recommend!",
    service: "EV Charger Installation"
  },
  {
    id: 3,
    name: "Tamara H",
    rating: 5,
    review: "We were in need of an electrician due to a tree ripping off the wire house and taking some wires down with it…within minutes of sending a request to CRC, Joe reached out. He was able to stop by the same day and complete the job the same day as well. Joe didn’t make us feel pressured. He educated us about the wires that were down. He was personable, professional and knowledgeable. Joe did a great job fixing everything up. We have found our go to electrician!",
    service: "Pool & Sauna Electrical"
  },
 {
    id: 4,
    name: "Jason T",
    rating: 5,
    review: "Joe from CRC Electrical was on time, knowledgeable, patient, and professional. He assessed the problem with my high hat lights in my kitchen and quickly found the problem and fixed it immediately. I would definitely use CRC Electrical if I have any future electrical problems. I would also highly recommend CRC Electrical to my friends and family. Thanks again Joe and CRC Electrical.",
    service: "Residential Electrical Services"
  },
  {
    id: 5,
    name: "Helen h",
    rating: 5,
    review: "very friendly, professional person. price was reasonable. came that morning for an estimate and completed the job that afternoon. will hire again. he is licensed and insured. that was important for me.",
    service: "Residential Electrical Services"
  },
  {
    id: 6,
    name: "Mary l",
    rating: 5,
    review: "Joe was wonderful. He had great communication, was prompt, very knowledgeable, worked nearly and quickly. Professional and friendly. Would DEFINITELY call him again and recommend him to everyone.",
    service: "Residential Electrical Services"
  }
];

// Thumbtack Logo Component
const ThumbTackLogo = () => (
  <SiThumbtack />
);

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${
            star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

const ReviewCard = ({ review }: { review: Review }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 mx-2 min-h-[280px] flex flex-col justify-between relative">
    {/* Thumbtack Logo - Top Right */}
    <div className="absolute top-4 right-4">
      <ThumbTackLogo />
    </div>
    
    <div>
      {/* Star Rating */}
      <div className="mb-4">
        <StarRating rating={review.rating} />
      </div>
      
      {/* Review Text */}
      <p className="text-gray-700 text-sm leading-relaxed mb-4 pr-8">
        "{review.review}"
      </p>
    </div>
    
    <div>
      {/* Service Type */}
      <p className="text-red-500 text-xs font-medium mb-2 uppercase tracking-wide">
        {review.service}
      </p>
      
      {/* Reviewer Name */}
      <p className="text-gray-900 font-semibold text-lg">
        {review.name}
      </p>
      
      {/* Verified Badge */}
      <p className="text-gray-500 text-xs mt-1">
        ✓ Verified Thumbtack Customer
      </p>
    </div>
  </div>
);

export default function ThumbTackReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrev = () => {
    setCurrentIndex(currentIndex === 0 ? reviews.length - 1 : currentIndex - 1);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10s
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === reviews.length - 1 ? 0 : currentIndex + 1);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10s
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10s
  };

  return (
    <section className="bg-black py-16 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What Our <span className="text-red-500">Customers</span> Say
          </h2>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto">
            Don't just take our word for it. See what verified Thumbtack customers are saying about CRC Electrical.
          </p>
        </div>

        {/* Reviews Slideshow */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
            aria-label="Next review"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Reviews Container */}
          <div className="mx-12">
            {/* Desktop View - Show 3 cards */}
            <div className="hidden md:block">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[0, 1, 2].map((offset) => {
                  const reviewIndex = (currentIndex + offset) % reviews.length;
                  return (
                    <div key={reviews[reviewIndex].id} className="transform transition-all duration-500">
                      <ReviewCard review={reviews[reviewIndex]} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile View - Show 1 card */}
            <div className="md:hidden">
              <div className="transform transition-all duration-500">
                <ReviewCard review={reviews[currentIndex]} />
              </div>
            </div>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-red-500 scale-125' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>

        {/* Thumbtack Attribution */}
        <div className="text-center mt-12">
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <ThumbTackLogo />
            <span className="text-sm">Verified reviews from Thumbtack customers</span>
          </div>
        </div>
      </div>
    </section>
  );
}