import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MessageSquare, User, Calendar, ThumbsUp, Flag } from "lucide-react";

interface PatientReviewManagementProps {
  facilityId: string;
}

const PatientReviewManagement = ({ facilityId }: PatientReviewManagementProps) => {
  const [reviews] = useState([
    {
      id: "1",
      patientName: "John Doe",
      doctorName: "Dr. Smith",
      department: "Cardiology",
      rating: 5,
      comment: "Excellent service and very professional staff. The doctor was very thorough and explained everything clearly.",
      date: "2024-01-15",
      status: "published",
      helpful: 12
    },
    {
      id: "2",
      patientName: "Jane Smith",
      doctorName: "Dr. Johnson",
      department: "General Medicine",
      rating: 4,
      comment: "Good experience overall. Wait time was a bit long but the consultation was worth it.",
      date: "2024-01-14",
      status: "published",
      helpful: 8
    },
    {
      id: "3",
      patientName: "Mike Wilson",
      doctorName: "Dr. Brown",
      department: "Orthopedics",
      rating: 3,
      comment: "Average experience. The facility could use some improvements in cleanliness.",
      date: "2024-01-13",
      status: "pending",
      helpful: 2
    },
    {
      id: "4",
      patientName: "Sarah Davis",
      doctorName: "Dr. Lee",
      department: "Pediatrics",
      rating: 1,
      comment: "Very poor service. Rude staff and unprofessional behavior.",
      date: "2024-01-12",
      status: "flagged",
      helpful: 0
    }
  ]);

  const stats = {
    averageRating: 4.2,
    totalReviews: 156,
    publishedReviews: 142,
    pendingReviews: 8,
    flaggedReviews: 6
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "default";
      case "pending":
        return "secondary";
      case "flagged":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Patient Reviews</h2>
        <div className="flex space-x-2">
          <Button variant="outline">Export Reviews</Button>
          <Button>Respond to Reviews</Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}</div>
            <div className="flex items-center space-x-1 mt-1">
              {renderStars(Math.round(stats.averageRating))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReviews}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingReviews}</div>
            <p className="text-xs text-muted-foreground">Need moderation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Reviews</CardTitle>
            <Flag className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.flaggedReviews}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Reviews</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="flagged">Flagged</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid gap-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-3">
                    <User className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-lg">{review.patientName}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {review.doctorName} • {review.department}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(review.status) as any}>
                      {review.status}
                    </Badge>
                    <div className="text-right">
                      {renderStars(review.rating)}
                      <p className="text-xs text-muted-foreground mt-1">{review.date}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{review.comment}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {review.helpful} found helpful
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      {review.status === "pending" && (
                        <>
                          <Button variant="outline" size="sm">Approve</Button>
                          <Button variant="destructive" size="sm">Reject</Button>
                        </>
                      )}
                      {review.status === "flagged" && (
                        <>
                          <Button variant="outline" size="sm">Resolve</Button>
                          <Button variant="destructive" size="sm">Hide</Button>
                        </>
                      )}
                      <Button variant="ghost" size="sm">Respond</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Reviews pending moderation will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flagged">
          <Card>
            <CardHeader>
              <CardTitle>Flagged Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Flagged reviews requiring attention will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Review Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Review analytics and trends coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientReviewManagement;