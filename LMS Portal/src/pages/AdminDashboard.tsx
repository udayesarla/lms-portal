import React from 'react';
import { Users, BookOpen, Activity, Settings } from 'lucide-react';
import { Course } from '../types';

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to React',
    description: 'Learn the fundamentals of React development',
    instructor: 'John Doe',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
    duration: '8 hours',
    enrolled: 156
  },
  {
    id: '2',
    title: 'Advanced TypeScript',
    description: 'Master TypeScript for large applications',
    instructor: 'Jane Smith',
    thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=800',
    duration: '10 hours',
    enrolled: 89
  }
];

export function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white h-screen shadow-lg">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800">LMS Admin</h2>
          </div>
          <nav className="mt-6">
            <a className="flex items-center py-3 px-6 text-gray-700 bg-gray-100 border-l-4 border-blue-600">
              <BookOpen className="w-5 h-5 mr-3" />
              Courses
            </a>
            <a className="flex items-center py-3 px-6 text-gray-600 hover:bg-gray-50">
              <Users className="w-5 h-5 mr-3" />
              Students
            </a>
            <a className="flex items-center py-3 px-6 text-gray-600 hover:bg-gray-50">
              <Activity className="w-5 h-5 mr-3" />
              Analytics
            </a>
            <a className="flex items-center py-3 px-6 text-gray-600 hover:bg-gray-50">
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 text-sm font-semibold">Total Students</h3>
              <p className="text-3xl font-bold text-gray-800">245</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 text-sm font-semibold">Active Courses</h3>
              <p className="text-3xl font-bold text-gray-800">12</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 text-sm font-semibold">Total Revenue</h3>
              <p className="text-3xl font-bold text-gray-800">$12,450</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Recent Courses</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Add New Course
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockCourses.map((course) => (
                <div key={course.id} className="bg-white border rounded-lg p-4">
                  <div className="flex">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">{course.title}</h3>
                      <p className="text-gray-600 text-sm">{course.description}</p>
                      <div className="mt-2 text-sm text-gray-500">
                        <span className="mr-4">{course.enrolled} students</span>
                        <span>{course.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}