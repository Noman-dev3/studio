// src/ai/flows/smart-search.ts
'use server';
/**
 * @fileOverview A smart search AI agent that finds information related to the school.
 *
 * - smartSearch - A function that handles the smart search process.
 * - SmartSearchInput - The input type for the smartSearch function.
 * - SmartSearchOutput - The return type for the smartSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { db } from '@/lib/db';

const SmartSearchInputSchema = z.object({
  query: z.string().describe('The search query string.'),
});
export type SmartSearchInput = z.infer<typeof SmartSearchInputSchema>;

const SmartSearchOutputSchema = z.object({
  results: z.array(z.string()).describe('The search results.'),
});
export type SmartSearchOutput = z.infer<typeof SmartSearchOutputSchema>;

export async function smartSearch(input: SmartSearchInput): Promise<SmartSearchOutput> {
  return smartSearchFlow(input);
}

// Tool for the AI to get information about the school
const getSchoolInfo = ai.defineTool(
  {
    name: 'getSchoolInfo',
    description: "Get information about the school, such as its mission, features, admission process, contact details, programs, and events. Also use this to retrieve student results.",
    inputSchema: z.object({
        topic: z.string().describe("The topic to search for. Can be 'mission', 'features', 'admissions', 'contact', 'programs', 'events', or a specific student's name, class, or roll number to get their result."),
        studentName: z.string().optional().describe("The student's name to search for a result."),
        studentClass: z.string().optional().describe("The student's class to search for a result."),
        studentRollNumber: z.string().optional().describe("The student's roll number to search for a result."),
    }),
    outputSchema: z.any(),
  },
  async ({ topic, studentName, studentClass, studentRollNumber }) => {
    if (studentRollNumber || (studentName && studentClass)) {
        const result = await db.getResult({ rollNumber: studentRollNumber, name: studentName, className: studentClass });
        if (result) {
            return `Found result for ${result.student_name} (Roll: ${result.roll_number}, Class: ${result.class}). Percentage: ${result.percentage}%, Grade: ${result.grade}.`;
        } else {
            return `No result found for the provided student details.`;
        }
    }

    switch(topic.toLowerCase()){
        case 'mission':
            return 'To provide a balanced and comprehensive education that integrates academic excellence with profound Islamic values. The mission is to nurture a new generation of leaders who are knowledgeable, pious, and ready to contribute positively to the global community.';
        case 'features':
            return 'Holistic Islamic & Academic Education, Certified & Experienced Faculty, State-of-the-Art Facilities, Focus on Character Building.';
        case 'admissions':
            return "To apply, visitors should go to the 'Admissions' page and fill out the online application form. Requirements include the student's name, date of birth, grade applying for, and parent/guardian contact details.";
        case 'contact':
            return "The school can be contacted via the form on the website. For specific contact details like phone or email, the user should check the footer of the website.";
        case 'programs':
            return 'The school offers classes from Playgroup and Nursery up to Grade 10.';
        case 'events':
            return "The school hosts several events like an Annual Science Fair, Annual Sports Day, and Charity Bake Sales. Specific dates are listed on the website's 'Events' section.";
        default:
            return `I don't have specific information about "${topic}". Please try a different topic or check the website.`;
    }
  }
);


const prompt = ai.definePrompt({
  name: 'smartSearchPrompt',
  input: {schema: SmartSearchInputSchema},
  output: {schema: SmartSearchOutputSchema},
  tools: [getSchoolInfo],
  prompt: `You are a helpful and friendly search assistant for the Pakistan Islamic International School System (PIISS) website.
Your goal is to answer user questions accurately by using the getSchoolInfo tool.
If the answer is not available, state that you don't have that information and suggest they contact the school directly.
Do not make up information.
Return your answer as a list of clear, concise points.

Query: {{{query}}}
`,
});

const smartSearchFlow = ai.defineFlow(
  {
    name: 'smartSearchFlow',
    inputSchema: SmartSearchInputSchema,
    outputSchema: SmartSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
