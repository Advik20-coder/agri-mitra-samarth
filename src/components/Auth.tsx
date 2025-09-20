import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Sprout, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthProps {
  onClose?: () => void;
}

const statesAndDistricts = {
  "Punjab": ["Amritsar", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Firozpur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Mohali", "Muktsar", "Pathankot", "Patiala", "Rupnagar", "Sangrur", "Shaheed Bhagat Singh Nagar", "Tarn Taran"],
  "Uttar Pradesh": ["Agra", "Aligarh", "Allahabad", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Faizabad", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
  "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],
  "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"]
};

export const Auth = ({ onClose }: AuthProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signUp, signIn } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate email format
      if (!validateEmail(email)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Validate password length
      if (password.length < 6) {
        toast({
          title: "Password Too Short",
          description: "Password must be at least 6 characters long",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      if (isSignUp) {
        if (!firstName || !lastName || !state || !district) {
          toast({
            title: "Missing Information",
            description: "Please fill in all required fields",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        const { error } = await signUp(email, password, {
          first_name: firstName,
          last_name: lastName,
          state,
          district
        });

        if (error) {
          let errorMessage = error.message;
          if (error.message.includes("User already registered")) {
            errorMessage = "An account with this email already exists. Please try signing in instead.";
          } else if (error.message.includes("Invalid email")) {
            errorMessage = "Please enter a valid email address.";
          } else if (error.message.includes("Password")) {
            errorMessage = "Password must be at least 6 characters long.";
          }
          
          toast({
            title: "Signup Failed",
            description: errorMessage,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Account Created Successfully!",
            description: "Please check your email to verify your account.",
          });
          onClose?.();
        }
      } else {
        const { error } = await signIn(email, password);
        
        if (error) {
          let errorMessage = error.message;
          if (error.message.includes("Invalid login credentials")) {
            errorMessage = "Invalid email or password. Please check your credentials and try again.";
          } else if (error.message.includes("Email not confirmed")) {
            errorMessage = "Please check your email and click the confirmation link before signing in.";
          }
          
          toast({
            title: "Login Failed",
            description: errorMessage,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Welcome Back!",
            description: "You have been logged in successfully.",
          });
          onClose?.();
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to the server. Please check your internet connection and try again.",
        variant: "destructive"
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <Sprout className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            CropAdvisor
          </span>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              {onClose && (
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <CardTitle>{isSignUp ? 'Sign Up' : 'Sign In'}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">First Name</label>
                      <Input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Last Name</label>
                      <Input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">State</label>
                    <Select value={state} onValueChange={(value) => {
                      setState(value);
                      setDistrict(''); // Reset district when state changes
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(statesAndDistricts).map((stateName) => (
                          <SelectItem key={stateName} value={stateName}>
                            {stateName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {state && (
                    <div>
                      <label className="text-sm font-medium">District</label>
                      <Select value={district} onValueChange={setDistrict}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select District" />
                        </SelectTrigger>
                        <SelectContent>
                          {statesAndDistricts[state as keyof typeof statesAndDistricts]?.map((districtName) => (
                            <SelectItem key={districtName} value={districtName}>
                              {districtName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </>
              )}
              
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                disabled={loading}
              >
                {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm"
                >
                  {isSignUp 
                    ? 'Already have an account? Sign In' 
                    : "Don't have an account? Sign Up"
                  }
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-4 text-center">
          <Link to="/">
            <Button variant="ghost" className="text-muted-foreground">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};