import Link from 'next/link';

import { prisma } from '@documenso/prisma';
import { Button } from '@documenso/ui/primitives/button';

type VerifyTeamEmailPageProps = {
  params: {
    token: string;
  };
};

export default async function VerifyTeamEmailPage({ params: { token } }: VerifyTeamEmailPageProps) {
  const teamEmailVerification = await prisma.teamEmailVerification.findUnique({
    where: {
      token,
    },
    include: {
      team: true,
    },
  });

  if (!teamEmailVerification || teamEmailVerification.expiresAt < new Date()) {
    return (
      <div>
        <h1 className="text-4xl font-semibold">Invalid link</h1>

        <p className="text-muted-foreground mb-4 mt-2 text-sm">
          This link is invalid or has expired. Please contact your team to resend a verification.
        </p>

        <Button asChild>
          <Link href="/">Return</Link>
        </Button>
      </div>
    );
  }

  const { team } = teamEmailVerification;

  try {
    await prisma.$transaction([
      prisma.teamEmailVerification.deleteMany({
        where: {
          teamId: team.id,
        },
      }),
      prisma.teamEmail.create({
        data: {
          teamId: team.id,
          email: teamEmailVerification.email,
          name: teamEmailVerification.name,
        },
      }),
    ]);
  } catch {
    return (
      <div>
        <h1 className="text-4xl font-semibold">Team email verification</h1>

        <p className="text-muted-foreground mt-2 text-sm">
          Something went wrong while attempting to verify your email address for{' '}
          <strong>{team.name}</strong>. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-semibold">Team email verified!</h1>

      <p className="text-muted-foreground mb-4 mt-2 text-sm">
        You have verified your email address for <strong>{team.name}</strong>.
      </p>

      <Button asChild>
        <Link href="/">Continue</Link>
      </Button>
    </div>
  );
}
