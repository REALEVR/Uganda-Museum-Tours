const Testimonials = () => {
  const testimonials = [
    {
      content: "As a Ugandan living abroad, these virtual tours have allowed me to reconnect with my heritage and share it with my children who have never visited.",
      author: "Sarah M.",
      role: "Ugandan Diaspora, Canada",
      rating: 5,
    },
    {
      content: "I'm planning a trip to Uganda and these virtual tours have been incredibly helpful in deciding which museums to visit in person. The detail is amazing!",
      author: "James T.",
      role: "Travel Enthusiast, UK",
      rating: 5,
    },
    {
      content: "I use these virtual tours in my classroom to teach students about African culture and history. It's much more engaging than textbooks!",
      author: "Professor David L.",
      role: "History Teacher, USA",
      rating: 4.5,
    },
  ];

  // Helper function to render stars
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="ri-star-fill"></i>);
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<i key="half" className="ri-star-half-fill"></i>);
    }

    return stars;
  };

  return (
    <section className="py-16 bg-primary/20 text-primary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl mb-3">What Our Users Say</h2>
          <p className="text-primary/80 max-w-2xl mx-auto">
            Discover how virtual tours are connecting people to Uganda's cultural heritage
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white shadow-md p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="text-primary">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
              <p className="italic mb-6 text-primary/80">
                "{testimonial.content}"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary/10 rounded-full mr-3 flex items-center justify-center">
                  <i className="ri-user-line text-primary/70"></i>
                </div>
                <div>
                  <h4 className="font-medium text-primary">{testimonial.author}</h4>
                  <p className="text-primary/70 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
