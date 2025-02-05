import IslandsContainer from '../islands/IslandsContainer';
import UserForm from '../UserForm';

export default function IslandsPage({ setCurrentIsland }) {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Island Journey
      </h1>
      <UserForm />
      <IslandsContainer setCurrentIsland={setCurrentIsland} />
    </div>
  );
} 