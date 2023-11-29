'use client';

import { useRouter } from 'next/navigation';

import { Edit, Loader, Mail, MoreHorizontal, X } from 'lucide-react';

import type { getTeamByUrl } from '@documenso/lib/server-only/team/get-teams';
import { trpc } from '@documenso/trpc/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@documenso/ui/primitives/dropdown-menu';
import { useToast } from '@documenso/ui/primitives/use-toast';

import UpdateTeamEmailDialog from '~/components/(teams)/dialogs/update-team-email-dialog';

export type TeamsSettingsPageProps = {
  team: Awaited<ReturnType<typeof getTeamByUrl>>;
};

export default function TeamEmailDropdown({ team }: TeamsSettingsPageProps) {
  const router = useRouter();

  const { toast } = useToast();

  const { mutateAsync: resendEmailVerification, isLoading: isResendingEmailVerification } =
    trpc.team.resendTeamEmailVerification.useMutation({
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Email verification has been resent',
          duration: 5000,
        });
      },
      onError: () => {
        toast({
          title: 'Something went wrong',
          variant: 'destructive',
          duration: 10000,
          description: 'Unable to resend verification at this time. Please try again.',
        });
      },
    });

  const { mutateAsync: deleteTeamEmail, isLoading: isDeletingTeamEmail } =
    trpc.team.deleteTeamEmail.useMutation({
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Team email has been deleted',
          duration: 5000,
        });
      },
      onError: () => {
        toast({
          title: 'Something went wrong',
          variant: 'destructive',
          duration: 10000,
          description: 'Unable to delete team email at this time. Please try again.',
        });
      },
    });

  const { mutateAsync: deleteTeamEmailVerification, isLoading: isDeletingTeamEmailVerification } =
    trpc.team.deleteTeamEmailVerification.useMutation({
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Email verification has been deleted',
          duration: 5000,
        });
      },
      onError: () => {
        toast({
          title: 'Something went wrong',
          variant: 'destructive',
          duration: 10000,
          description: 'Unable to delete email verification at this time. Please try again.',
        });
      },
    });

  const onRemove = async () => {
    if (team.email) {
      await deleteTeamEmail({ teamId: team.id });
    }

    if (team.emailVerification) {
      await deleteTeamEmailVerification({ teamId: team.id });
    }

    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal className="text-muted-foreground h-5 w-5" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-52" align="start" forceMount>
        {!team.email && team.emailVerification && (
          <DropdownMenuItem
            disabled={isResendingEmailVerification}
            onClick={(e) => {
              e.preventDefault();
              void resendEmailVerification({ teamId: team.id });
            }}
          >
            {isResendingEmailVerification ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Mail className="mr-2 h-4 w-4" />
            )}
            Resend verification
          </DropdownMenuItem>
        )}

        {team.email && (
          <UpdateTeamEmailDialog
            teamEmail={team.email}
            trigger={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            }
          />
        )}

        <DropdownMenuItem
          disabled={isDeletingTeamEmail || isDeletingTeamEmailVerification}
          onClick={async () => onRemove()}
        >
          <X className="mr-2 h-4 w-4" />
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
