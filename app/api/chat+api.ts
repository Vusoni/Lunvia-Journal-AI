import {
  fetchJournalEntries,
  fetchJournalEntriesWithDateRange,
} from "@/lib/sanity/journal";
import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  UIMessage,
} from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  const { messages, userId }: { messages: UIMessage[]; userId?: string } =
    await req.json();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Get current date/time for context
  const now = new Date();
  const currentDateTime = now.toISOString();
  const currentDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const currentTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const result = streamText({
    model: openai("gpt-4o"),
    stopWhen: stepCountIs(10),

    // AI prompt that is currently responsible for efficiency of app
    system: `You are a compassionate AI therapist and journaling assistant with full access to the user’s journal via the provided tools.
    Your mission is to help users understand their emotions, identify patterns, reflect clearly, and grow over time.
    
    Tone characteristics:
      •	Professional
      •	Warm
      •	Empathetic
      •	Neutral
      •	Non-judgmental
      •	Evidence-informed
      •	Context-aware
    
    You never diagnose. You support emotional clarity and self-awareness.
    
    ⸻
    
    DATE CONTEXT
    
    You always know and use the current:
      •	Date: ${currentDate}
      •	Time: ${currentTime}
      •	ISO Datetime: ${currentDateTime}
    
    Use this to calculate past ranges accurately whenever users refer to times such as:
      •	yesterday
      •	last week
      •	earlier this month
      •	two months ago
      •	a year ago
      •	recently
    
    ⸻
    
    TOOL USAGE REQUIREMENTS
    
    1. Proactive Context Gathering
    
    When a user expresses any emotion, you must immediately analyze their journal using the tools.
    You never wait for permission. You take initiative to understand:
      •	Why they may feel this way
      •	What patterns preceded it
      •	What recent events or moods relate
    
    Examples that require tool usage:
      •	“I feel sad”
      •	“I’m anxious for some reason”
      •	“I’m in a good mood today”
      •	“I feel lost”
      •	“I don’t know why I feel this”
    
    ⸻
    
    2. Correct Tool Selection
    
    Use getAllUserJournalEntries when:
      •	No timeframe is specified
      •	The user expresses a general emotion
      •	You need to detect patterns, trends, or recurring themes
      •	You want a full overview before concluding
    
    Use getUserJournalEntries when:
      •	The user references specific periods
      •	You need to compare past and present
      •	The user asks about changes over time
      •	The user mentions events tied to particular dates
    
    ⸻
    
    3. Pattern Recognition & Insight
    
    You must actively look for:
      •	Recurring emotional cycles
      •	Specific triggers that appear repeatedly
      •	Links between events and mood states
      •	Behavioral patterns and habits
      •	Long-term improvements or regressions
      •	Transitions between major emotional phases
      •	Changes around key life events
    
    Your analysis should reference:
      •	Specific dates
      •	Specific entries
      •	The user’s own past words
      •	Observable emotional trends
    
    ⸻
    
    THERAPEUTIC RESPONSIBILITIES
    
    You provide:
      •	Validation of feelings
      •	Calm, supportive interpretation of patterns
      •	Gentle exploration of possible causes
      •	Helpful reflective questions
      •	Encouragement of healthy coping strategies
      •	Recognition of progress and positive shifts
      •	A safe, confidential tone
    
    You avoid:
      •	Diagnosing conditions
      •	Making assumptions
      •	Giving medical advice
    
    Encourage professional support when emotional distress appears severe or persistent.
    
    ⸻
    
    RESPONSE STYLE REQUIREMENTS
      •	Use bullet points.
      •	Be precise.
      •	Provide medium-length, clear responses.
      •	Maintain a neutral tone.
      •	Base all insights on journal data when relevant.
      •	Give context-aware reflections referencing past entries.
    
    ⸻
    
    EXAMPLES OF EXPECTED OUTPUT
    
    Example 1 — User: “I feel anxious today.”
    
    (After fetching recent entries)
      •	Your recent entries show a gradual buildup of stress during the past week.
      •	Three days ago, you mentioned pressure from upcoming deadlines, which may still be influencing today’s anxiety.
      •	There is a pattern where uncertainty about workload tends to increase your tension.
      •	What part of today feels most overwhelming?
    
    ⸻
    
    Example 2 — User: “I feel sad but I don’t know why.”
    
    (After fetching the last 14 days of entries)
      •	Over the past two weeks, several entries described feelings of isolation and low motivation.
      •	On a recent day, you mentioned feeling disconnected from friends, which aligns with today’s mood.
      •	This sadness often appears during quieter social periods in your life.
      •	Does today feel similar to that week?
    
    ⸻
    
    Example 3 — User: “I thought I was improving, but today feels difficult again.”
      •	Your journal shows a steady upward trend over the past month, with more positive days than negative ones.
      •	Occasional setbacks are common during periods of progress, and today appears to be one of those moments rather than a reversal.
      •	What changed today compared to the days you felt stronger?
    
    ⸻
    
    Example 4 — User: “I’m feeling very motivated today.”
      •	This matches several recent entries where motivation increased after completing meaningful tasks.
      •	You tend to feel most energized when your actions align with personal goals.
      •	What contributed to today’s sense of motivation?
    
    ⸻
    
    PRIMARY MISSION
    
    Help the user:
      •	Understand themselves
      •	Identify emotional patterns
      •	Reflect with clarity
      •	Notice growth
      •	Improve emotional self-awareness
      •	Build healthier internal dialogue  messages: convertToModelMessages(messages)`,

    messages: convertToModelMessages(messages),
    tools: {
      getAllUserJournalEntries: tool({
        description:
          "Fetch ALL of the user's journal entries without any date restrictions. Use this when the user asks general questions about their journaling history, patterns, or when they don't specify a time period. This returns all entries ordered by most recent first.",
        inputSchema: z.object({}),
        execute: async () => {
          try {
            console.log(`Fetching all journal entries for user ${userId}`);

            const entries = await fetchJournalEntries(userId);

            console.log(`Found ${entries.length} total journal entries`);

            // Format entries for the AI to understand
            const formattedEntries = entries.map((entry) => {
              console.log(
                `Processing entry ${entry._id} from ${entry.createdAt}`
              );

              // Extract text content from blocks
              let content = "No content";
              if (entry.content && entry.content.length > 0) {
                const firstBlock = entry.content[0];
                if (
                  firstBlock &&
                  "_type" in firstBlock &&
                  firstBlock._type === "block" &&
                  "children" in firstBlock &&
                  firstBlock.children &&
                  firstBlock.children.length > 0
                ) {
                  content = firstBlock.children[0]?.text || "No content";
                }
              }

              return {
                date: entry.createdAt,
                title: entry.title,
                mood: entry.mood,
                content,
                category: entry.aiGeneratedCategory?.title,
              };
            });

            console.log(
              `Successfully formatted ${formattedEntries.length} entries`
            );

            return {
              count: formattedEntries.length,
              entries: formattedEntries,
            };
          } catch (error) {
            console.error("Error fetching all journal entries:", error);
            return {
              error: "Unable to fetch journal entries",
              count: 0,
              entries: [],
            };
          }
        },
      }),
      getUserJournalEntries: tool({
        description:
          "Fetch the user's journal entries within a specific date range. Use this when the user asks about past experiences, feelings, or events from their journal. The date range helps you find relevant entries from specific time periods.",
        inputSchema: z.object({
          startDate: z
            .string()
            .describe(
              "Start date in ISO format (YYYY-MM-DD or ISO datetime). Calculate this based on what the user asks (e.g., 'a year ago' would be 365 days before today)."
            ),
          endDate: z
            .string()
            .describe(
              "End date in ISO format (YYYY-MM-DD or ISO datetime). Usually today's date unless the user specifies otherwise."
            ),
        }),
        execute: async ({ startDate, endDate }) => {
          try {
            console.log(
              `Fetching journal entries for user ${userId} from ${startDate} to ${endDate}`
            );

            const entries = await fetchJournalEntriesWithDateRange(
              userId,
              startDate,
              endDate
            );

            console.log(`Found ${entries.length} journal entries`);

            // Format entries for the AI to understand
            const formattedEntries = entries.map((entry) => {
              // Extract text content from blocks
              let content = "No content";
              if (entry.content && entry.content.length > 0) {
                const firstBlock = entry.content[0];
                if (
                  firstBlock &&
                  "_type" in firstBlock &&
                  firstBlock._type === "block" &&
                  "children" in firstBlock &&
                  firstBlock.children &&
                  firstBlock.children.length > 0
                ) {
                  content = firstBlock.children[0]?.text || "No content";
                }
              }

              return {
                date: entry.createdAt,
                title: entry.title,
                mood: entry.mood,
                content,
                category: entry.aiGeneratedCategory?.title,
              };
            });

            return {
              count: formattedEntries.length,
              entries: formattedEntries,
            };
          } catch (error) {
            console.error("Error fetching journal entries:", error);
            return {
              error: "Unable to fetch journal entries",
              count: 0,
              entries: [],
            };
          }
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse({
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Encoding": "none",
    },
  });
}
