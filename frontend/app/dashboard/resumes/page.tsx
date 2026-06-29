export default function ResumesDashboard() {
  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen bg-background text-foreground">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Resumes</h1>
        <a href="/builder/new" className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-hover">
          Create New Resume
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-lg">Software Engineer V2</h3>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">ATS: 95</span>
          </div>
          <p className="text-sm opacity-60 mb-4">Last edited 2 days ago</p>
          <div className="flex gap-2">
            <a href="/builder/123" className="text-primary text-sm font-medium hover:underline">Edit</a>
            <button className="text-primary text-sm font-medium hover:underline">Download PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
}
