import React, { useEffect, useState } from 'react';
import { BookOpen, Clock, Award, User } from 'lucide-react';
import { Course } from '../types';
import { YouTubeCourse } from '../components/dashboard/YouTubeCourse';
import { supabase } from '../lib/supabase';

export function UserDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const { data: userCourses, error: userCoursesError } = await supabase
          .from('user_courses')
          .select(`
            course_id,
            progress,
            courses (*)
          `);

        if (userCoursesError) throw userCoursesError;

        const formattedCourses = userCourses.map((uc) => ({
          ...(uc.courses as Course),
          progress: uc.progress,
        }));

        setCourses(formattedCourses);
      } catch (error) {
        console.error('Error loading courses:', error);
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white h-screen shadow-lg">
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
                alt="Profile"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h2 className="text-lg font-semibold text-gray-800">John Doe</h2>
                <p className="text-sm text-gray-600">Student</p>
              </div>
            </div>
          </div>
          <nav className="mt-6">
            <a className="flex items-center py-3 px-6 text-gray-700 bg-gray-100 border-l-4 border-blue-600">
              <BookOpen className="w-5 h-5 mr-3" />
              My Courses
            </a>
            <a className="flex items-center py-3 px-6 text-gray-600 hover:bg-gray-50">
              <Clock className="w-5 h-5 mr-3" />
              Schedule
            </a>
            <a className="flex items-center py-3 px-6 text-gray-600 hover:bg-gray-50">
              <Award className="w-5 h-5 mr-3" />
              Certificates
            </a>
            <a className="flex items-center py-3 px-6 text-gray-600 hover:bg-gray-50">
              <User className="w-5 h-5 mr-3" />
              Profile
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back!</h1>
            <p className="text-gray-600">Continue your learning journey</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 text-sm font-semibold">Courses in Progress</h3>
              <p className="text-3xl font-bold text-gray-800">{courses.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 text-sm font-semibold">Hours Learned</h3>
              <p className="text-3xl font-bold text-gray-800">26</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 text-sm font-semibold">Certificates Earned</h3>
              <p className="text-3xl font-bold text-gray-800">2</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Continue Learning</h2>
            {loading ? (
              <div className="text-center py-8">Loading your courses...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <YouTubeCourse key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}