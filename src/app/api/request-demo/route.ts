import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { saveRequestToDatabase } from "@/actions/db";

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, company, role, message } =
      await request.json();

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "First name, last name, and email are required" },
        { status: 400 }
      );
    }

    // Create invitation through Clerk
    const invitation = await clerkClient.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/sign-up`,
      notify: true,
      publicMetadata: {
        firstName,
        lastName,
        company,
        role,
        message,
        requestedAt: new Date().toISOString(),
      },
    });

    //  Store the request in your database
    await saveRequestToDatabase({
      firstName,
      lastName,
      email,
      company,
      role,
      message,
      invitationId: invitation.id,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Demo request submitted successfully",
      invitationId: invitation.id,
    });
  } catch (error) {
    console.error("Error creating invitation:", error);

    // Handle specific Clerk errors
    if (error instanceof Error) {
      if (error.message.includes("already exists")) {
        return NextResponse.json(
          {
            error: "An invitation has already been sent to this email address",
          },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to process demo request" },
      { status: 500 }
    );
  }
}
