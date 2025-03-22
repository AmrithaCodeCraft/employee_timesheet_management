import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function Profile() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500">
      <h1 className="text-3xl font-bold text-white mb-6">Profile Settings</h1>

      <div className="bg-white p-6 rounded-lg shadow-md w-[400px]">
        <Input type="text" placeholder="Full Name" className="mb-4" />
        <Input type="email" placeholder="Email Address" className="mb-4" />
        <Button className="bg-blue-500 text-white w-full">
          Update Profile
        </Button>
      </div>
    </div>
  );
}
