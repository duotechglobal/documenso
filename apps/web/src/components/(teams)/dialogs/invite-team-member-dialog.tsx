'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import type * as DialogPrimitive from '@radix-ui/react-dialog';
import { Mail, PlusCircle, Trash } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { TEAM_MEMBER_ROLE_MAP } from '@documenso/lib/constants/teams';
import { TeamMemberRole } from '@documenso/prisma/client';
import { trpc } from '@documenso/trpc/react';
import { ZInviteTeamMembersMutationSchema } from '@documenso/trpc/server/team-router/schema';
import { cn } from '@documenso/ui/lib/utils';
import { Button } from '@documenso/ui/primitives/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@documenso/ui/primitives/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@documenso/ui/primitives/form/form';
import { Input } from '@documenso/ui/primitives/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@documenso/ui/primitives/select';
import { useToast } from '@documenso/ui/primitives/use-toast';

export const ZInviteTeamMembersFormSchema = z
  .object({
    invitations: ZInviteTeamMembersMutationSchema.shape.invitations,
  })
  // Todo: Teams
  .refine(
    (schema) => {
      const emails = schema.invitations.map((invitation) => invitation.email.toLowerCase());

      return new Set(emails).size === emails.length;
    },
    // Dirty hack to handle errors when .root is populated for an array type
    { message: 'Members must have unique emails', path: ['members__root'] },
  );

export type TInviteTeamMembersFormSchema = z.infer<typeof ZInviteTeamMembersFormSchema>;

export type InviteTeamMembersDialogProps = {
  teamId: number;
  trigger?: React.ReactNode;
} & Omit<DialogPrimitive.DialogProps, 'children'>;

export default function InviteTeamMembersDialog({
  teamId,
  trigger,
  ...props
}: InviteTeamMembersDialogProps) {
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  const form = useForm<TInviteTeamMembersFormSchema>({
    resolver: zodResolver(ZInviteTeamMembersFormSchema),
    defaultValues: {
      invitations: [
        {
          email: '',
          role: TeamMemberRole.MEMBER,
        },
      ],
    },
  });

  const {
    append: appendTeamMemberInvite,
    fields: teamMemberInvites,
    remove: removeTeamMemberInvite,
  } = useFieldArray({
    control: form.control,
    name: 'invitations',
  });

  const { mutateAsync: inviteTeamMembers } = trpc.team.inviteTeamMembers.useMutation();

  const onAddTeamMemberInvite = () => {
    appendTeamMemberInvite({
      email: '',
      role: TeamMemberRole.MEMBER,
    });
  };

  const onFormSubmit = async ({ invitations }: TInviteTeamMembersFormSchema) => {
    try {
      await inviteTeamMembers({
        teamId,
        invitations,
      });

      toast({
        title: 'Success',
        description: 'Team invitations have been sent.',
        duration: 5000,
      });

      setOpen(false);
    } catch {
      toast({
        title: 'An unknown error occurred',
        variant: 'destructive',
        description:
          'We encountered an unknown error while attempting to invite team members. Please try again later.',
      });
    }
  };

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Dialog
      {...props}
      open={open}
      onOpenChange={(value) => !form.formState.isSubmitting && setOpen(value)}
    >
      <DialogTrigger onClick={(e) => e.stopPropagation()} asChild={true}>
        {trigger ?? <Button variant="secondary">Invite member</Button>}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite team members</DialogTitle>

          <DialogDescription className="mt-4">
            An email containing an invitation will be sent to each member.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)}>
            <fieldset className="flex h-full flex-col" disabled={form.formState.isSubmitting}>
              <div className="space-y-4">
                {teamMemberInvites.map((teamMemberInvite, index) => (
                  <div className="flex w-full flex-row space-x-4" key={teamMemberInvite.id}>
                    <FormField
                      control={form.control}
                      name={`invitations.${index}.email`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          {index === 0 && <FormLabel required>Email address</FormLabel>}
                          <FormControl>
                            <Input className="bg-background" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`invitations.${index}.role`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          {index === 0 && <FormLabel required>Role</FormLabel>}
                          <FormControl>
                            <Select {...field} onValueChange={field.onChange}>
                              <SelectTrigger className="text-muted-foreground max-w-[200px]">
                                <SelectValue />
                              </SelectTrigger>

                              <SelectContent position="popper">
                                {Object.values(TeamMemberRole).map((role) => (
                                  <SelectItem key={role} value={role}>
                                    {TEAM_MEMBER_ROLE_MAP[role] ?? role}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <button
                      type="button"
                      className={cn(
                        'justify-left inline-flex h-10 w-10 items-center text-slate-500 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50',
                        index === 0 ? 'mt-8' : 'mt-0',
                      )}
                      disabled={teamMemberInvites.length === 1}
                      onClick={() => removeTeamMemberInvite(index)}
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </div>
                ))}

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onAddTeamMemberInvite()}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add more members
                </Button>

                <DialogFooter className="space-x-4">
                  <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>

                  <Button type="submit" loading={form.formState.isSubmitting}>
                    {!form.formState.isSubmitting && <Mail className="mr-2 h-4 w-4" />}
                    Invite
                  </Button>
                </DialogFooter>
              </div>
            </fieldset>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
