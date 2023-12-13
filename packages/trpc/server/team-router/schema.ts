import { z } from 'zod';

import { TeamMemberRole } from '@documenso/prisma/client';

export const ZAddTeamEmailVerificationMutationSchema = z.object({
  teamId: z.number(),
  // Todo: Teams - Share with form?
  name: z.string().trim().min(1, { message: 'Please enter a valid name.' }),
  email: z.string().trim().email().min(1, 'Please enter a valid email.'),
});

export const ZCreateTeamMutationSchema = z.object({
  name: z.string().min(1),
  url: z.string().min(1), // Todo: Apply regex. Todo: lowercase, etc
  // avatar: z.string().min(1), Todo: Teams
});

export const ZDeleteTeamEmailMutationSchema = z.object({
  teamId: z.number(),
});

export const ZDeleteTeamEmailVerificationMutationSchema = z.object({
  teamId: z.number(),
});

export const ZDeleteTeamMembersMutationSchema = z.object({
  teamId: z.number(),
  teamMemberIds: z.array(z.number()),
});

export const ZDeleteTeamMemberInvitationsMutationSchema = z.object({
  teamId: z.number(),
  invitationIds: z.array(z.number()),
});

export const ZDeleteTeamMutationSchema = z.object({
  teamId: z.number(),
});

export const ZDeleteTeamPendingMutationSchema = z.object({
  teamPendingId: z.number(),
});

export const ZDeleteTeamTransferRequestMutationSchema = z.object({
  teamId: z.number(),
});

export const ZFindTeamMemberInvitesQuerySchema = z.object({
  teamId: z.number(),
  term: z.string().optional(),
  page: z.number().optional(),
  perPage: z.number().optional(),
});

export const ZFindTeamMembersQuerySchema = z.object({
  teamId: z.number(),
  term: z.string().optional(),
  page: z.number().optional(),
  perPage: z.number().optional(),
});

export const ZFindTeamsQuerySchema = z.object({
  term: z.string().optional(),
  page: z.number().optional(),
  perPage: z.number().optional(),
});

export const ZFindTeamsPendingQuerySchema = z.object({
  term: z.string().optional(),
  page: z.number().optional(),
  perPage: z.number().optional(),
});

export const ZGetTeamQuerySchema = z.object({
  teamId: z.number(),
});

export const ZGetTeamMembersQuerySchema = z.object({
  teamId: z.number(),
});

export const ZLeaveTeamMutationSchema = z.object({
  teamId: z.number(),
});

export const ZInviteTeamMembersMutationSchema = z.object({
  teamId: z.number(),
  invitations: z.array(
    z.object({
      email: z.string().email(),
      role: z.nativeEnum(TeamMemberRole),
    }),
  ),
});

export const ZUpdateTeamMutationSchema = z.object({
  teamId: z.number(),
  data: z.object({
    // Todo: Teams
    name: z.string().min(1),
    url: z.string().min(1), // Todo: Apply regex. Todo: lowercase, etc
    // avatar: z.string().min(1), Todo: Teams
  }),
});

export const ZUpdateTeamEmailMutationSchema = z.object({
  teamId: z.number(),
  data: z.object({
    name: z.string().min(1),
  }),
});

export const ZUpdateTeamMemberMutationSchema = z.object({
  teamId: z.number(),
  teamMemberId: z.number(),
  data: z.object({
    role: z.nativeEnum(TeamMemberRole),
  }),
});

export const ZRequestTeamOwnerhsipTransferMutationSchema = z.object({
  teamId: z.number(),
  newOwnerUserId: z.number(),
});

export const ZResendTeamEmailVerificationMutationSchema = z.object({
  teamId: z.number(),
});

export const ZResendTeamMemberInvitationMutationSchema = z.object({
  teamId: z.number(),
  invitationId: z.number(),
});

export type TAddTeamEmailVerificationMutationSchema = z.infer<
  typeof ZAddTeamEmailVerificationMutationSchema
>;
export type TCreateTeamMutationSchema = z.infer<typeof ZCreateTeamMutationSchema>;
export type TDeleteTeamEmailMutationSchema = z.infer<typeof ZDeleteTeamEmailMutationSchema>;
export type TDeleteTeamMembersMutationSchema = z.infer<typeof ZDeleteTeamMembersMutationSchema>;
export type TDeleteTeamMutationSchema = z.infer<typeof ZDeleteTeamMutationSchema>;
export type TDeleteTeamPendingMutationSchema = z.infer<typeof ZDeleteTeamPendingMutationSchema>;
export type TDeleteTeamTransferRequestMutationSchema = z.infer<
  typeof ZDeleteTeamTransferRequestMutationSchema
>;
export type TFindTeamMemberInvitesQuerySchema = z.infer<typeof ZFindTeamMembersQuerySchema>;
export type TFindTeamMembersQuerySchema = z.infer<typeof ZFindTeamMembersQuerySchema>;
export type TFindTeamsQuerySchema = z.infer<typeof ZFindTeamsQuerySchema>;
export type TFindTeamsPendingQuerySchema = z.infer<typeof ZFindTeamsPendingQuerySchema>;
export type TGetTeamQuerySchema = z.infer<typeof ZGetTeamQuerySchema>;
export type TGetTeamMembersQuerySchema = z.infer<typeof ZGetTeamMembersQuerySchema>;
export type TInviteTeamMembersMutationSchema = z.infer<typeof ZInviteTeamMembersMutationSchema>;
export type TLeaveTeamMutationSchema = z.infer<typeof ZLeaveTeamMutationSchema>;
export type TUpdateTeamMutationSchema = z.infer<typeof ZUpdateTeamMutationSchema>;
export type TUpdateTeamEmailMutationSchema = z.infer<typeof ZUpdateTeamEmailMutationSchema>;
export type TRequestTeamOwnerhsipTransferMutationSchema = z.infer<
  typeof ZRequestTeamOwnerhsipTransferMutationSchema
>;
export type TResendTeamEmailVerificationMutationSchema = z.infer<
  typeof ZResendTeamEmailVerificationMutationSchema
>;
export type TResendTeamMemberInvitationMutationSchema = z.infer<
  typeof ZResendTeamMemberInvitationMutationSchema
>;
