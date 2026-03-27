import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    // FREE AI Response - Rule-based chatbot (No API key needed!)
    const response = generateFreeResponse(message);

    return NextResponse.json({
      data: {
        message: response.message,
        relatedProducts: response.products,
      },
    });
  } catch (error) {
    console.error("API Route Error:", error);

    return NextResponse.json(
      {
        error: "Failed to process message",
        data: {
          message: "Sorry, I encountered an error. Please try again!",
          relatedProducts: [],
        },
      },
      { status: 500 },
    );
  }
}

// FREE Rule-based AI Chatbot - No API Key Required!
function generateFreeResponse(message) {
  const lowerMessage = message.toLowerCase().trim();

  // Property database
  const properties = [
    { id: 1, name: "Luxury Apartment in Dhaka", price: 15000000 },
    { id: 2, name: "Modern Office Space", price: 8500000 },
    { id: 3, name: "Residential Plot", price: 5000000 },
    { id: 4, name: "Commercial Complex", price: 25000000 },
    { id: 5, name: "Family Home with Garden", price: 12000000 },
  ];

  let responseMessage = "";
  let relatedProducts = [];

  // Greeting responses
  if (
    lowerMessage.match(/^(hi|hello|hey|greetings|good morning|good afternoon)/)
  ) {
    responseMessage =
      "👋 Hello! Welcome to UrbanEstate! I'm your AI assistant. How can I help you find your dream property today?";
  }

  // Price/budget questions
  else if (
    lowerMessage.includes("price") ||
    lowerMessage.includes("cost") ||
    lowerMessage.includes("budget")
  ) {
    responseMessage =
      "💰 Our properties range from ৳50 lakh to ৳2.5 crore depending on location, size, and type. What's your budget range? I can show you properties that fit within it!";
    relatedProducts = [properties[2], properties[1]];
  }

  // Location questions
  else if (
    lowerMessage.includes("location") ||
    lowerMessage.includes("area") ||
    lowerMessage.includes("where")
  ) {
    responseMessage =
      "📍 We have properties in prime locations across Dhaka including Gulshan, Banani, Dhanmondi, Uttara, and Bashundhara R/A. Which area interests you?";
  }

  // Apartment/Flat requests
  else if (
    lowerMessage.includes("apartment") ||
    lowerMessage.includes("flat") ||
    lowerMessage.includes("unit")
  ) {
    responseMessage =
      "🏢 Great choice! Our luxury apartments feature modern amenities, 24/7 security, parking, and great views. Prices start from ৳1.2 crore.";
    relatedProducts = [properties[0], properties[4]];
  }

  // Office/Commercial requests
  else if (
    lowerMessage.includes("office") ||
    lowerMessage.includes("commercial") ||
    lowerMessage.includes("business")
  ) {
    responseMessage =
      "🏬 Perfect! Our commercial spaces are ideal for businesses, located in prime areas with excellent connectivity.";
    relatedProducts = [properties[1], properties[3]];
  }

  // Plot/Land requests
  else if (
    lowerMessage.includes("plot") ||
    lowerMessage.includes("land") ||
    lowerMessage.includes("ground")
  ) {
    responseMessage =
      "🏗️ Excellent! Residential plots are available in developed areas with all utilities. Great for building your custom home!";
    relatedProducts = [properties[2]];
  }

  // Amenities questions
  else if (
    lowerMessage.includes("amenit") ||
    lowerMessage.includes("facilit") ||
    lowerMessage.includes("feature")
  ) {
    responseMessage =
      "✨ Our properties include: 24/7 security, CCTV surveillance, generator backup, parking, gym, swimming pool, children's play area, and more!";
  }

  // Payment/EMI questions
  else if (
    lowerMessage.includes("payment") ||
    lowerMessage.includes("emi") ||
    lowerMessage.includes("installment")
  ) {
    responseMessage =
      "💳 Yes! We offer easy EMI facilities with flexible payment plans. You can pay in installments over 5-10 years with low interest rates.";
  }

  // Contact/Visit questions
  else if (
    lowerMessage.includes("contact") ||
    lowerMessage.includes("visit") ||
    lowerMessage.includes("see") ||
    lowerMessage.includes("meeting")
  ) {
    responseMessage =
      "📞 We'd love to meet you! You can visit our office or schedule a property tour. Our team will contact you shortly to arrange everything!";
  }

  // Thank you
  else if (lowerMessage.includes("thank")) {
    responseMessage =
      "😊 You're welcome! Is there anything else I can help you with regarding properties?";
  }

  // Default response
  else {
    responseMessage =
      "🏠 Thank you for your interest in UrbanEstate! I'm here to help you find the perfect property. Could you tell me more about what you're looking for? (e.g., apartment, plot, office space, budget, preferred location)";
    relatedProducts = [properties[0], properties[2], properties[4]];
  }

  return {
    message: responseMessage,
    products: relatedProducts,
  };
}
