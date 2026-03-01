// mockData.js

export const complaints = [
    {
      id: "CMP-001",
      title: "Water Problem",
      issueType: "water_leak",
      priority: "high",
      description:
        "Excessive water problem in the residential area. Water has been leaking from the main pipeline causing flooding on the streets.",
      images: [
        "https://res.cloudinary.com/dtctbti8i/image/upload/v1772204301/complaint_sample.jpg",
      ],
      landmark: "Kurla",
      location_coords: { lat: 19.063311028041582, lng: 72.88358685413411 },
      address: "Mumbai, Maharashtra",
      status: "received",
      created_at: "2026-02-27T14:58:22.091+00:00",
      updated_at: "2026-02-27T14:58:22.091+00:00",
    },
    {
      id: "CMP-002",
      title: "Street Light Not Working",
      issueType: "electrical",
      priority: "medium",
      description:
        "Multiple street lights in the colony are not functioning for the past 3 days. The area is very dark at night causing safety concerns.",
      images: [],
      landmark: "Andheri East",
      location_coords: { lat: 19.1136, lng: 72.8697 },
      address: "Andheri East, Mumbai",
      status: "received",
      created_at: "2026-02-26T10:30:00.000+00:00",
      updated_at: "2026-02-26T10:30:00.000+00:00",
    },
    {
      id: "CMP-003",
      title: "Garbage Overflow",
      issueType: "sanitation",
      priority: "high",
      description:
        "Garbage bins near the market area are overflowing. The waste is spreading on the road and causing a foul smell.",
      images: [],
      landmark: "Dadar Market",
      location_coords: { lat: 19.0178, lng: 72.8478 },
      address: "Dadar, Mumbai",
      status: "received",
      created_at: "2026-02-25T08:15:00.000+00:00",
      updated_at: "2026-02-25T08:15:00.000+00:00",
    },
    {
      id: "CMP-004",
      title: "Road Pothole",
      issueType: "road_damage",
      priority: "low",
      description:
        "A large pothole has formed near the junction. Several two-wheelers have had accidents due to this.",
      images: [],
      landmark: "Bandra Station",
      location_coords: { lat: 19.0544, lng: 72.8404 },
      address: "Bandra West, Mumbai",
      status: "assigned",
      created_at: "2026-02-24T16:45:00.000+00:00",
      updated_at: "2026-02-25T09:00:00.000+00:00",
      assignedTo: "vol-1",
    },
  ];
  
  export const volunteers = [
    {
      id: "vol-1",
      name: "Rahul Sharma",
      email: "rahul.sharma@email.com",
      mobile: "+91 98765 43210",
      location: "Kurla, Mumbai",
      avatar: "RS",
    },
    {
      id: "vol-2",
      name: "Priya Patel",
      email: "priya.patel@email.com",
      mobile: "+91 87654 32109",
      location: "Andheri, Mumbai",
      avatar: "PP",
    },
    {
      id: "vol-3",
      name: "Amit Kumar",
      email: "amit.kumar@email.com",
      mobile: "+91 76543 21098",
      location: "Dadar, Mumbai",
      avatar: "AK",
    },
    {
      id: "vol-4",
      name: "Sneha Desai",
      email: "sneha.desai@email.com",
      mobile: "+91 65432 10987",
      location: "Bandra, Mumbai",
      avatar: "SD",
    },
  ];