import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import PrototypeDisclaimer from '@/components/PrototypeDisclaimer';
import CoursePlayer from '@/components/CoursePlayer';
import { getCourseById, getAssessmentById, getEnrollment } from '@/lib/data-service';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getSessionUser();

  const course = await getCourseById(id);
  if (!course) {
    notFound();
  }

  const [assessment, enrollment] = await Promise.all([
    course.assessmentId ? getAssessmentById(course.assessmentId) : null,
    user ? getEnrollment(course._id, user.id) : null,
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header user={user} />
      <PrototypeDisclaimer />

      <main className="flex-1 portal-container py-8">
        <CoursePlayer
          course={course}
          initialEnrollment={enrollment}
          assessment={assessment}
          user={user}
        />
      </main>
    </div>
  );
}
