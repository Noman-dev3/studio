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

const schoolContextPrompt = `
You are a helpful and friendly search assistant for the Pakistan Islamic International School System (PIISS) website.
Your goal is to answer user questions accurately based on the information provided below.
If the answer is not available in the provided context, state that you don't have that information and suggest they contact the school directly.
Do not make up information.

Here is the information about the school:

- School Name: Pakistan Islamic International School System (PIISS)
- Mission: To provide a balanced and comprehensive education that integrates academic excellence with profound Islamic values. The mission is to nurture a new generation of leaders who are knowledgeable, pious, and ready to contribute positively to the global community.
- Key Features: Holistic Islamic & Academic Education, Certified & Experienced Faculty, State-of-the-Art Facilities, Focus on Character Building.
- Admissions: To apply, visitors should go to the "Admissions" page and fill out the online application form. Requirements include the student's name, date of birth, grade applying for, and parent/guardian contact details.
- Contact Information: The school can be contacted via the form on the website. For specific contact details like phone or email, the user should check the footer of the website.
- Programs: The school offers classes from Playgroup and Nursery up to Grade 10.
- Events: The school hosts several events like an Annual Science Fair, Annual Sports Day, and Charity Bake Sales. Specific dates are listed on the website's "Events" section.
`;


const prompt = ai.definePrompt({
  name: 'smartSearchPrompt',
  input: {schema: SmartSearchInputSchema},
  output: {schema: SmartSearchOutputSchema},
  prompt: `${schoolContextPrompt}

Given the context above, please answer the following user query. Return your answer as a list of clear, concise points.

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
