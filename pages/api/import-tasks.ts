// pages/api/import-tasks.ts
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../utils/database';

// Interface for Nous Research task format
interface NousTask {
  name: string;
  description: string;
  modality: string;
  diagram: null | string;
  citations: null | string[];
  examples: Array<Array<{
    input: string;
    output: string;
  }>>;
  tags: string[];
}

// Transform Nous format to your app's format
function transformNousTask(nousTask: NousTask): any {
  // Flatten examples into a single string
  const exampleText = nousTask.examples
    .map((exampleSet, setIndex) => 
      exampleSet.map((example, exIndex) => 
        `Example ${setIndex + 1}.${exIndex + 1}:\nInput: ${example.input}\nOutput: ${example.output}`
      ).join('\n\n')
    ).join('\n\n---\n\n');

  return {
    title: nousTask.name,
    category: nousTask.modality || 'Uncategorized',
    description: nousTask.description,
    example: exampleText,
    testMethod: 'N/A', // Nous format doesn't have this field
    links: nousTask.citations || [],
    tags: nousTask.tags || []
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Optional: Add authentication here
  const { adminPassword } = req.body;
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Fetch the list of files from GitHub API
    const repoResponse = await fetch(
      'https://api.github.com/repos/NousResearch/Open-Reasoning-Tasks/contents/tasks-json',
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          // Optional: Add GitHub token if you hit rate limits
          // 'Authorization': `token ${process.env.GITHUB_TOKEN}`
        }
      }
    );

    if (!repoResponse.ok) {
      throw new Error('Failed to fetch repository contents');
    }

    const files = await repoResponse.json();
    
    // Filter only JSON files
    const jsonFiles = files.filter((file: any) => file.name.endsWith('.json'));

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('tasks');

    let importedCount = 0;
    let skippedCount = 0;
    const errors: string[] = [];

    // Process each JSON file
    for (const file of jsonFiles) {
      try {
        // Fetch the raw content of each JSON file
        const contentResponse = await fetch(file.download_url);
        if (!contentResponse.ok) {
          errors.push(`Failed to fetch ${file.name}`);
          continue;
        }

        const nousTask: NousTask = await contentResponse.json();
        
        // Transform to your format
        const transformedTask = transformNousTask(nousTask);

        // Check if task already exists (by title)
        const existingTask = await collection.findOne({ title: transformedTask.title });
        
        if (existingTask) {
          skippedCount++;
          console.log(`Skipping duplicate task: ${transformedTask.title}`);
        } else {
          // Insert the task
          await collection.insertOne(transformedTask);
          importedCount++;
          console.log(`Imported task: ${transformedTask.title}`);
        }

      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        errors.push(`Error processing ${file.name}: ${error}`);
      }
    }

    res.status(200).json({
      success: true,
      message: `Import completed. Imported: ${importedCount}, Skipped: ${skippedCount}`,
      imported: importedCount,
      skipped: skippedCount,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to import tasks',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}