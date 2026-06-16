export interface Stat {
  value: string;
  label: string;
}

export interface Service {
  icon: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  bookingUrl?: string;
}

export interface GalleryItem {
  title: string;
  emoji: string;
}

export interface Testimonial {
  name: string;
  text: string;
  rating: number;
  service: string;
  avatar: string;
}

export interface SiteContent {
  salon: { name: string; tagline: string };
  hero: {
    badge: string;
    headline: string;
    subheadline: string;
    cta1: string;
    cta2: string;
    stats: Stat[];
  };
  services: {
    title: string;
    subtitle: string;
    items: Service[];
  };
  about: {
    badge: string;
    title: string;
    body: string;
    stats: Stat[];
  };
  gallery: {
    title: string;
    subtitle: string;
    items: GalleryItem[];
  };
  testimonials: {
    title: string;
    subtitle: string;
    items: Testimonial[];
  };
  contact: {
    title: string;
    subtitle: string;
    address: string;
    phone: string;
    email: string;
    hours: string;
  };
  footer: { tagline: string };
}

export const defaultContent: SiteContent = {
  salon: {
    name: "Polished Nail Studio",
    tagline: "Where Every Nail Tells a Story",
  },
  hero: {
    badge: "✨ Premium Nail Studio",
    headline: "Your Nails, Your Masterpiece",
    subheadline:
      "Premium nail care crafted with precision, artistry, and passion. Step in for a luxurious experience that leaves you feeling absolutely flawless.",
    cta1: "Book Appointment",
    cta2: "Explore Services",
    stats: [
      { value: "5+", label: "Years Experience" },
      { value: "8K+", label: "Happy Clients" },
      { value: "12", label: "Nail Artists" },
      { value: "4.9★", label: "Average Rating" },
    ],
  },
  services: {
    title: "Our Services",
    subtitle: "Every treatment is a work of art",
    items: [
      {
        icon: "💅",
        title: "Classic Manicure",
        description:
          "Shape, buff, and polish for timeless elegant nails with long-lasting results.",
        price: "From $20",
        duration: "45 min",
      },
      {
        icon: "✨",
        title: "Gel Manicure",
        description:
          "Long-lasting gel color that stays chip-free and glossy for up to 3 weeks.",
        price: "From $30",
        duration: "60 min",
      },
      {
        icon: "💎",
        title: "Acrylic Nails",
        description:
          "Full acrylic sets with custom length, shape, and your choice of design.",
        price: "From $45",
        duration: "90 min",
      },
      {
        icon: "🎨",
        title: "Nail Art & Design",
        description:
          "Intricate patterns, gems, foils, and custom nail art by our skilled artists.",
        price: "From $15",
        duration: "30 min",
      },
      {
        icon: "🦶",
        title: "Luxury Pedicure",
        description:
          "Relaxing foot treatment with exfoliation, massage, and polish.",
        price: "From $35",
        duration: "75 min",
      },
      {
        icon: "💖",
        title: "Nail Extensions",
        description:
          "BIAB, silk wrap, and gel extensions for added length and strength.",
        price: "$25",
        duration: "120 min",
        bookingUrl: "https://link.fastpaydirect.com/payment-link/6a2a4a0a71a0aa761e4642c2",
      },
    ],
  },
  about: {
    badge: "Our Story",
    title: "Every Nail Tells a Beautiful Story",
    body: "Founded in 2019, Polished Nail Studio was born from a deep passion for nail artistry and a belief that everyone deserves a luxurious self-care experience. Our team of certified nail technicians brings creativity, precision, and heartfelt care to every single appointment.\n\nWe use only premium, cruelty-free products to ensure the health and beauty of your nails. From classic elegance to bold nail art, we turn your vision into reality.",
    stats: [
      { value: "2019", label: "Year Founded" },
      { value: "8,000+", label: "Happy Clients" },
      { value: "12", label: "Expert Artists" },
      { value: "4.9★", label: "Client Rating" },
    ],
  },
  gallery: {
    title: "Beauty in Every Detail",
    subtitle: "A glimpse of our finest work",
    items: [
      { title: "Gel Nails", emoji: "✨" },
      { title: "Nail Art", emoji: "🎨" },
      { title: "French Tips", emoji: "🤍" },
      { title: "Acrylic Sets", emoji: "💎" },
      { title: "Luxury Pedicure", emoji: "🦶" },
      { title: "Chrome Nails", emoji: "💫" },
    ],
  },
  testimonials: {
    title: "What Our Clients Say",
    subtitle: "Real experiences from our community",
    items: [
      {
        name: "Sophia R.",
        text: "Absolutely obsessed with my gel nails from Polished! The technician was so skilled and patient with my design. I will never go anywhere else — the quality is unmatched!",
        rating: 5,
        service: "Gel Manicure",
        avatar: "S",
      },
      {
        name: "Priya M.",
        text: "The best nail studio in London. My acrylic set has lasted 4 weeks without any lifting. The atmosphere is so relaxing and the team is incredibly talented.",
        rating: 5,
        service: "Acrylic Nails",
        avatar: "P",
      },
      {
        name: "Emma T.",
        text: "I came in for a simple pedicure and left feeling like royalty! The luxury foot treatment was beyond my expectations. The foot massage alone is worth every penny!",
        rating: 5,
        service: "Luxury Pedicure",
        avatar: "E",
      },
    ],
  },
  contact: {
    title: "Book Your Appointment",
    subtitle: "Treat yourself to the nails you deserve",
    address: "42 High Street, London, W1K 2QN",
    phone: "+44 20 7946 0958",
    email: "hello@polishednails.co.uk",
    hours: "Mon–Fri: 9am–7pm  |  Sat: 9am–6pm  |  Sun: 10am–5pm",
  },
  footer: {
    tagline:
      "Crafting beautiful nails with passion and precision since 2019.",
  },
};
