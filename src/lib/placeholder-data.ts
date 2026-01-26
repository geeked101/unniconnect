export interface FeedItem {
    id: string;
    author: string;
    avatarUrl?: string;
    content: string;
    timestamp: string;
    likes: number;
    comments: number;
    anonymous: boolean;
}

export interface CouncilAnnouncement {
    id: string;
    title: string;
    date: string;
    summary: string;
}

export interface CouncilSurvey {
    id: string;
    title: string;
    description: string;
    participants: number;
    total: number;
}

export interface MarketplaceItem {
    id: string;
    name: string;
    price: number;
    seller: string;
    imageId: string;
}

export interface CourseGroup {
    id: string;
    courseCode: string;
    courseName: string;
    members: number;
    imageUrl: string;
}

export const communityFeed: FeedItem[] = [
    {
        id: "1",
        author: "Sensei",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sensei",
        content: "Just finished the mid-term project for CS302. Feeling so relieved! Anyone else in the same boat?",
        timestamp: "2 hours ago",
        likes: 12,
        comments: 4,
        anonymous: false,
    },
    {
        id: "2",
        author: "Anonymous",
        content: "Does anyone know if the library is open 24/7 during the exam week?",
        timestamp: "4 hours ago",
        likes: 8,
        comments: 15,
        anonymous: true,
    },
    {
        id: "3",
        author: "Student Council",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Council",
        content: "The new coffee shop near the engineering block is actually pretty good. Highly recommend the caramel latte!",
        timestamp: "6 hours ago",
        likes: 24,
        comments: 2,
        anonymous: false,
    },
];

export const councilAnnouncements: CouncilAnnouncement[] = [
    {
        id: "1",
        title: "New Study Spaces Opening",
        date: "October 15, 2023",
        summary: "We are excited to announce that three new study lounges will be opening in the Student Union building starting next week.",
    },
    {
        id: "2",
        title: "Campus Sustainability Initiative",
        date: "October 10, 2023",
        summary: "Join us for a town hall meeting to discuss the new campus-wide recycling program and how you can get involved.",
    },
    {
        id: "3",
        title: "Winter Ball Early Bird Tickets",
        date: "October 5, 2023",
        summary: "Early bird tickets for the annual Winter Ball are now available! Get yours before they sell out.",
    },
];

export const councilSurveys: CouncilSurvey[] = [
    {
        id: "1",
        title: "Campus Dining Satisfaction",
        description: "Share your thoughts on the quality and variety of food in the campus dining halls.",
        participants: 1240,
        total: 5000,
    },
    {
        id: "2",
        title: "Library Hours Extension",
        description: "Should the library be open 24/7 during the entire semester or just during exams?",
        participants: 3500,
        total: 5000,
    },
];

export const courseGroups: CourseGroup[] = [
    {
        id: "1",
        courseCode: "CS101",
        courseName: "Introduction to Computer Science",
        members: 156,
        imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    },
    {
        id: "2",
        courseCode: "BIO202",
        courseName: "Genetics and Molecular Biology",
        members: 89,
        imageUrl: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=80",
    },
    {
        id: "3",
        courseCode: "ENG305",
        courseName: "Advanced Technical Writing",
        members: 45,
        imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
    },
];

export const marketplaceItems: MarketplaceItem[] = [
    {
        id: "1",
        name: "Calculus: Early Transcendentals (8th Ed)",
        price: 45.00,
        seller: "Student_01",
        imageId: "book_1",
    },
    {
        id: "2",
        name: "Ergonomic Desk Chair",
        price: 60.00,
        seller: "Sensei",
        imageId: "chair_1",
    },
    {
        id: "3",
        name: "TI-84 Plus CE Graphing Calculator",
        price: 80.00,
        seller: "MathMajor",
        imageId: "calc_1",
    },
    {
        id: "4",
        name: "Dorm-Size Mini Fridge",
        price: 50.00,
        seller: "CampusLife",
        imageId: "fridge_1",
    },
];
