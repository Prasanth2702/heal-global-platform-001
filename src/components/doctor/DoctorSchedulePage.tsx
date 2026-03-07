import React, { useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Trash2,
  Search,
  RefreshCw,
  Stethoscope,
  Activity,
  HeartPulse,
  Timer,
  AlertTriangle,
  CheckCheck,
  Eye,
} from 'lucide-react';
import { mixpanelInstance } from '@/utils/mixpanel';

// Set up the calendar localizer
const localizer = momentLocalizer(moment);

// Types
interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  type: 'consultation' | 'follow-up' | 'emergency' | 'checkup';
  reason?: string;
  notes?: string;
  patient?: {
    id: string;
    first_name: string;
    last_name: string;
    gender?: string;
    phone?: string;
    email?: string;
    blood_group?: string;
    avatar_url?: string;
    age?: number;
  };
}

interface ScheduleStats {
  totalAppointments: number;
  completedToday: number;
  pendingToday: number;
  cancelledToday: number;
  averageDuration: number;
  nextAppointment?: Appointment;
  busyHours: number;
  freeHours: number;
}

// Mock Data
const MOCK_DOCTOR = {
  id: 'doc1',
  user_id: 'user1',
  first_name: 'Sarah',
  last_name: 'Johnson',
  specialty: 'Cardiologist',
  avatar_url: 'https://i.pravatar.cc/150?u=sarah',
};

const MOCK_PATIENTS = [
  {
    id: 'p1',
    first_name: 'John',
    last_name: 'Smith',
    gender: 'Male',
    phone: '+1 234-567-8901',
    email: 'john.smith@email.com',
    blood_group: 'A+',
    age: 45,
    avatar_url: 'https://i.pravatar.cc/150?u=john',
  },
  {
    id: 'p2',
    first_name: 'Emily',
    last_name: 'Davis',
    gender: 'Female',
    phone: '+1 234-567-8902',
    email: 'emily.davis@email.com',
    blood_group: 'O-',
    age: 32,
    avatar_url: 'https://i.pravatar.cc/150?u=emily',
  },
  {
    id: 'p3',
    first_name: 'Michael',
    last_name: 'Wilson',
    gender: 'Male',
    phone: '+1 234-567-8903',
    email: 'michael.w@email.com',
    blood_group: 'B+',
    age: 58,
    avatar_url: 'https://i.pravatar.cc/150?u=michael',
  },
  {
    id: 'p4',
    first_name: 'Jessica',
    last_name: 'Brown',
    gender: 'Female',
    phone: '+1 234-567-8904',
    email: 'jessica.b@email.com',
    blood_group: 'AB+',
    age: 28,
    avatar_url: 'https://i.pravatar.cc/150?u=jessica',
  },
];

// Generate mock appointments for today
const generateMockAppointments = (): Appointment[] => {
  const today = new Date().toISOString().split('T')[0];
  
  return [
    {
      id: 'apt1',
      patient_id: 'p1',
      doctor_id: 'doc1',
      appointment_date: today,
      start_time: '09:00:00',
      end_time: '09:30:00',
      status: 'completed',
      type: 'checkup',
      reason: 'Annual physical examination',
      notes: 'Patient reported feeling well',
      patient: MOCK_PATIENTS[0],
    },
    {
      id: 'apt2',
      patient_id: 'p2',
      doctor_id: 'doc1',
      appointment_date: today,
      start_time: '10:00:00',
      end_time: '10:30:00',
      status: 'in-progress',
      type: 'consultation',
      reason: 'Chest pain and shortness of breath',
      notes: 'ECG scheduled',
      patient: MOCK_PATIENTS[1],
    },
    {
      id: 'apt3',
      patient_id: 'p3',
      doctor_id: 'doc1',
      appointment_date: today,
      start_time: '11:00:00',
      end_time: '11:30:00',
      status: 'confirmed',
      type: 'follow-up',
      reason: 'Post-surgery follow-up',
      patient: MOCK_PATIENTS[2],
    },
    {
      id: 'apt4',
      patient_id: 'p4',
      doctor_id: 'doc1',
      appointment_date: today,
      start_time: '14:00:00',
      end_time: '14:30:00',
      status: 'scheduled',
      type: 'consultation',
      reason: 'High blood pressure review',
      patient: MOCK_PATIENTS[3],
    },
    {
      id: 'apt5',
      patient_id: 'p1',
      doctor_id: 'doc1',
      appointment_date: today,
      start_time: '15:30:00',
      end_time: '16:00:00',
      status: 'cancelled',
      type: 'emergency',
      reason: 'Urgent care visit - cancelled',
      notes: 'Patient rescheduled',
      patient: MOCK_PATIENTS[0],
    },
  ];
};

const DoctorSchedulePage: React.FC = () => {
  // State
  // Mixpanel import
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const [appointments, setAppointments] = useState<Appointment[]>(generateMockAppointments());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarView, setCalendarView] = useState(Views.WEEK);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    patient_id: '',
    appointment_date: '',
    start_time: '',
    end_time: '',
    type: 'consultation' as Appointment['type'],
    reason: '',
    notes: '',
    status: 'scheduled' as Appointment['status'],
  });

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate stats
  const stats: ScheduleStats = {
    totalAppointments: appointments.length,
    completedToday: appointments.filter(a => a.status === 'completed').length,
    pendingToday: appointments.filter(a => ['scheduled', 'confirmed', 'in-progress'].includes(a.status)).length,
    cancelledToday: appointments.filter(a => ['cancelled', 'no-show'].includes(a.status)).length,
    averageDuration: 30,
    nextAppointment: appointments.find(a => a.status === 'scheduled' || a.status === 'confirmed'),
    busyHours: appointments.filter(a => a.status !== 'cancelled').length * 0.5,
    freeHours: 8 - (appointments.filter(a => a.status !== 'cancelled').length * 0.5),
  };

  // Handlers
  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsEditMode(true);
    setFormData({
      patient_id: appointment.patient_id,
      appointment_date: appointment.appointment_date,
      start_time: appointment.start_time,
      end_time: appointment.end_time,
      type: appointment.type,
      reason: appointment.reason || '',
      notes: appointment.notes || '',
      status: appointment.status,
    });
    setIsAppointmentDialogOpen(true);
  };

  const handleNewAppointment = () => {
    setSelectedAppointment(null);
    setIsEditMode(false);
    setFormData({
      patient_id: '',
      appointment_date: selectedDate.toISOString().split('T')[0],
      start_time: '',
      end_time: '',
      type: 'consultation',
      reason: '',
      notes: '',
      status: 'scheduled',
    });
    setIsAppointmentDialogOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mixpanel tracking
    mixpanelInstance.track(
      isEditMode ? 'Doctor Appointment Updated' : 'Doctor Appointment Created',
      {
        doctor_id: MOCK_DOCTOR.id,
        patient_id: formData.patient_id,
        appointment_date: formData.appointment_date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        type: formData.type,
        status: formData.status,
      }
    );
    // Demo: Just show success message
    alert(isEditMode ? 'Appointment updated (demo)' : 'Appointment created (demo)');
    setIsAppointmentDialogOpen(false);
  };

  const handleStatusChange = (appointmentId: string, newStatus: Appointment['status']) => {
    // Demo: Update local state
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      )
    );
    alert(`Status changed to ${newStatus} (demo)`);
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    if (!confirm('Delete this appointment? (demo)')) return;
    
    // Demo: Remove from local state
    setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
    setIsAppointmentDialogOpen(false);
    alert('Appointment deleted (demo)');
  };

  // Helper functions
  const getStatusBadge = (status: Appointment['status']) => {
    const statusConfig = {
      scheduled: { color: 'bg-blue-100 text-blue-800', icon: Clock },
      confirmed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'in-progress': { color: 'bg-yellow-100 text-yellow-800', icon: Activity },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCheck },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle },
      'no-show': { color: 'bg-gray-100 text-gray-800', icon: AlertTriangle },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon size={12} />
        {status}
      </Badge>
    );
  };

  const getTypeBadge = (type: Appointment['type']) => {
    const typeConfig = {
      consultation: { color: 'bg-purple-100 text-purple-800', icon: Stethoscope },
      'follow-up': { color: 'bg-indigo-100 text-indigo-800', icon: RefreshCw },
      emergency: { color: 'bg-red-100 text-red-800', icon: AlertCircle },
      checkup: { color: 'bg-green-100 text-green-800', icon: HeartPulse },
    };

    const config = typeConfig[type];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon size={12} />
        {type}
      </Badge>
    );
  };

  const calendarEvents = appointments.map(apt => ({
    id: apt.id,
    title: `${apt.patient?.first_name} ${apt.patient?.last_name} - ${apt.type}`,
    start: new Date(`${apt.appointment_date}T${apt.start_time}`),
    end: new Date(`${apt.appointment_date}T${apt.end_time}`),
    resource: apt,
  }));

  const filteredAppointments = appointments.filter(apt => {
    if (statusFilter !== 'all' && apt.status !== statusFilter) return false;
    if (typeFilter !== 'all' && apt.type !== typeFilter) return false;
    if (searchQuery) {
      const patientName = `${apt.patient?.first_name} ${apt.patient?.last_name}`.toLowerCase();
      return patientName.includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const eventStyleGetter = (event: any) => {
    const status = event.resource.status;
    let backgroundColor = '#3b82f6';
    
    switch (status) {
      case 'completed': backgroundColor = '#10b981'; break;
      case 'cancelled':
      case 'no-show': backgroundColor = '#ef4444'; break;
      case 'in-progress': backgroundColor = '#f59e0b'; break;
      case 'confirmed': backgroundColor = '#8b5cf6'; break;
      default: backgroundColor = '#3b82f6';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '8px',
        opacity: 0.8,
        color: 'white',
        border: 'none',
        display: 'block',
      },
    };
  };

  const formatTime = (time: string) => {
    return moment(time, 'HH:mm:ss').format('h:mm A');
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Schedule (Demo)</h1>
            <p className="text-muted-foreground">
              Dr. {MOCK_DOCTOR.first_name} {MOCK_DOCTOR.last_name} - {MOCK_DOCTOR.specialty}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setAppointments(generateMockAppointments())}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Demo
            </Button>
            <Button onClick={handleNewAppointment}>
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Appointments</p>
                  <p className="text-3xl font-bold">{appointments.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <CalendarIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                <span>{stats.completedToday} completed, {stats.pendingToday} pending</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Next Appointment</p>
                  {stats.nextAppointment ? (
                    <>
                      <p className="text-lg font-bold">
                        {formatTime(stats.nextAppointment.start_time)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {stats.nextAppointment.patient?.first_name} {stats.nextAppointment.patient?.last_name}
                      </p>
                    </>
                  ) : (
                    <p className="text-lg font-bold text-muted-foreground">No upcoming</p>
                  )}
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Workload Today</p>
                  <p className="text-3xl font-bold">
                    {Math.round((stats.busyHours / 8) * 100)}%
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Activity className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <Timer className="h-4 w-4 mr-1" />
                <span>{stats.busyHours.toFixed(1)}h busy / {stats.freeHours.toFixed(1)}h free</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Duration</p>
                  <p className="text-3xl font-bold">{stats.averageDuration} min</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Timer className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar View */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment Calendar</CardTitle>
            <CardDescription>
              Demo view - showing mock appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[600px]">
              <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                views={['week', 'day']}
                defaultView={Views.WEEK}
                view={calendarView}
                onView={setCalendarView}
                date={selectedDate}
                onNavigate={setSelectedDate}
                eventPropGetter={eventStyleGetter}
                onSelectEvent={(event) => handleAppointmentClick(event.resource)}
                popup
                selectable
                step={30}
                timeslots={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* List View */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Today's Appointments</CardTitle>
                <CardDescription>
                  {filteredAppointments.length} appointments scheduled
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search patients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="follow-up">Follow Up</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="checkup">Checkup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={appointment.patient?.avatar_url} />
                      <AvatarFallback>
                        {getInitials(appointment.patient?.first_name, appointment.patient?.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">
                            {appointment.patient?.first_name} {appointment.patient?.last_name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}</span>
                            {appointment.patient?.gender && (
                              <>
                                <span>•</span>
                                <span>{appointment.patient.gender}, {appointment.patient.age}</span>
                              </>
                            )}
                            {appointment.patient?.blood_group && (
                              <>
                                <span>•</span>
                                <span>Blood: {appointment.patient.blood_group}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(appointment.status)}
                          {getTypeBadge(appointment.type)}
                        </div>
                      </div>
                      
                      {appointment.reason && (
                        <p className="text-sm text-muted-foreground mb-2">
                          <span className="font-medium">Reason:</span> {appointment.reason}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAppointmentClick(appointment)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        
                        {appointment.status === 'scheduled' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600"
                            onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Confirm
                          </Button>
                        )}
                        
                        {appointment.status === 'confirmed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-yellow-600"
                            onClick={() => handleStatusChange(appointment.id, 'in-progress')}
                          >
                            <Activity className="h-3 w-3 mr-1" />
                            Start
                          </Button>
                        )}
                        
                        {appointment.status === 'in-progress' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600"
                            onClick={() => handleStatusChange(appointment.id, 'completed')}
                          >
                            <CheckCheck className="h-3 w-3 mr-1" />
                            Complete
                          </Button>
                        )}
                        
                        {!['completed', 'cancelled'].includes(appointment.status) && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Appointments Found</h3>
                  <p className="text-muted-foreground mb-4">
                    There are no appointments matching your filters.
                  </p>
                  <Button onClick={handleNewAppointment}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Appointment
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Appointment Dialog */}
        <Dialog open={isAppointmentDialogOpen} onOpenChange={setIsAppointmentDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? 'Appointment Details (Demo)' : 'New Appointment (Demo)'}
              </DialogTitle>
              <DialogDescription>
                {isEditMode 
                  ? 'View and manage appointment details' 
                  : 'Schedule a new appointment with a patient'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patient_id">Patient</Label>
                  <Select
                    value={formData.patient_id}
                    onValueChange={(value) => setFormData({ ...formData, patient_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_PATIENTS.map(patient => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.first_name} {patient.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Appointment Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="follow-up">Follow Up</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="checkup">Checkup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="appointment_date">Date</Label>
                  <Input
                    id="appointment_date"
                    type="date"
                    value={formData.appointment_date}
                    onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_time">Start Time</Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_time">End Time</Label>
                  <Input
                    id="end_time"
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Visit</Label>
                <Input
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Brief reason for appointment"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes or instructions"
                  rows={3}
                />
              </div>

              {isEditMode && selectedAppointment && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-semibold mb-2">Patient Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>{' '}
                      {selectedAppointment.patient?.first_name} {selectedAppointment.patient?.last_name}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Gender:</span>{' '}
                      {selectedAppointment.patient?.gender || 'N/A'}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Age:</span>{' '}
                      {selectedAppointment.patient?.age || 'N/A'}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Blood Group:</span>{' '}
                      {selectedAppointment.patient?.blood_group || 'N/A'}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>{' '}
                      {selectedAppointment.patient?.phone || 'N/A'}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>{' '}
                      {selectedAppointment.patient?.email || 'N/A'}
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter className="gap-2">
                {isEditMode && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleDeleteAppointment(selectedAppointment!.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}
                <Button type="button" variant="outline" onClick={() => setIsAppointmentDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={() => {
                    mixpanelInstance.track(
                      isEditMode ? 'Doctor Appointment Main Button Clicked' : 'Doctor Appointment Main Button Clicked',
                      {
                        doctor_id: MOCK_DOCTOR.id,
                        patient_id: formData.patient_id,
                        appointment_date: formData.appointment_date,
                        start_time: formData.start_time,
                        end_time: formData.end_time,
                        type: formData.type,
                        status: formData.status,
                      }
                    );
                  }}
                >
                  {isEditMode ? 'Update (Demo)' : 'Create (Demo)'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Demo Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-blue-600 text-sm">
            ⚡ This is a demo version with mock data. No actual database operations are performed.
          </p>
        </div>
      </div>
  );
};

export default DoctorSchedulePage;