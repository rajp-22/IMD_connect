import { NextResponse } from 'next/server';
import { getCertificateByVerificationCode } from '@/lib/data-service';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cert = await getCertificateByVerificationCode(id);

    if (!cert) {
      return NextResponse.json(
        { success: false, error: 'Certificate not found or invalid' },
        { status: 404 }
      );
    }

    // Return sanitized public verification details without sensitive personal information
    return NextResponse.json({
      success: true,
      verified: true,
      certificate: {
        certificateId: cert.certificateId,
        traineeName: cert.traineeName,
        courseName: cert.courseName,
        trainerName: cert.trainerName,
        issueDate: cert.issueDate,
        scorePercentage: cert.scorePercentage,
        preScorePercentage: cert.preScorePercentage,
        status: 'Officially Verified & Authentic',
        issuingAuthority: 'India Meteorological Department (IMD) MeghSetu Directorate',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
