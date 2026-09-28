import { NextResponse } from 'next/server';
import { recordPreAssessmentAttempt, getAssessmentById } from '@/lib/data-service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { assessmentId, courseId, traineeId, answers, score } = body;
    const targetAssessmentId = assessmentId || (courseId ? 'assess_001' : null);

    if (!targetAssessmentId || !traineeId) {
      return NextResponse.json(
        { error: 'assessmentId (or courseId) and traineeId are required' },
        { status: 400 }
      );
    }

    const assessment = await getAssessmentById(targetAssessmentId);
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    let finalScore = 0;
    if (score !== undefined) {
      finalScore = Number(score);
    } else if (Array.isArray(answers)) {
      answers.forEach((ans: { questionIndex: number; selectedOption: number }) => {
        const q = assessment.questions[ans.questionIndex];
        if (q && q.correctAnswerIndex === ans.selectedOption) {
          finalScore += q.marks;
        }
      });
    }

    const enrollment = await recordPreAssessmentAttempt(
      traineeId,
      assessment.courseId,
      answers || [],
      finalScore,
      assessment.totalMarks
    );

    return NextResponse.json({
      success: true,
      score: finalScore,
      totalMarks: assessment.totalMarks,
      percentage: Math.round((finalScore / assessment.totalMarks) * 100),
      enrollment,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
