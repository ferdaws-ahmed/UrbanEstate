export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  // পেজ নম্বর এবং লিমিট সেট করা
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = 15;
  const skip = (page - 1) * limit;

  try {
    const propertiesCollection = await connect("properties");
    
    // মোট কয়টি ডাটা আছে তা বের করা (বাটন দেখানোর জন্য)
    const totalProperties = await propertiesCollection.countDocuments();
    
    // নির্দিষ্ট ১৫টি ডাটা ফেচ করা
    const properties = await propertiesCollection
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      properties,
      totalPages: Math.ceil(totalProperties / limit),
      currentPage: page
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}