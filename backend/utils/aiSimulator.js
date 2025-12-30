// AI Simulator for generating task summaries and tags
// This simulates AI functionality by analyzing task content

const generateSummary = (title, description) => {
  // Simulate AI analysis - in production, this would call an actual AI service
  const words = (title + ' ' + description).toLowerCase().split(/\s+/);
  const keyPhrases = [];
  
  // Extract important keywords
  const importantWords = words.filter(word => 
    word.length > 4 && 
    !['this', 'that', 'with', 'from', 'will', 'have', 'been', 'were'].includes(word)
  );
  
  // Generate summary based on content
  if (description && description.length > 20) {
    const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 10);
    if (sentences.length > 0) {
      return sentences[0].trim().substring(0, 150) + (sentences[0].length > 150 ? '...' : '');
    }
  }
  
  // Fallback summary
  return `Task focused on ${title.toLowerCase()}. ${description ? description.substring(0, 100) : 'No additional details provided.'}`;
};

const generateTags = (title, description) => {
  // Simulate AI tag generation
  const content = (title + ' ' + (description || '')).toLowerCase();
  const tags = [];
  
  // Category-based tags
  if (content.match(/\b(meeting|call|discuss|review)\b/)) tags.push('meeting');
  if (content.match(/\b(bug|fix|error|issue|problem)\b/)) tags.push('bug-fix');
  if (content.match(/\b(feature|implement|add|create|build)\b/)) tags.push('feature');
  if (content.match(/\b(test|testing|qa|quality)\b/)) tags.push('testing');
  if (content.match(/\b(document|docs|write|update)\b/)) tags.push('documentation');
  if (content.match(/\b(urgent|asap|critical|important)\b/)) tags.push('urgent');
  if (content.match(/\b(refactor|optimize|improve|enhance)\b/)) tags.push('refactor');
  if (content.match(/\b(design|ui|ux|frontend)\b/)) tags.push('design');
  if (content.match(/\b(backend|api|server|database)\b/)) tags.push('backend');
  if (content.match(/\b(mobile|app|ios|android)\b/)) tags.push('mobile');
  
  // Priority-based tags
  if (content.match(/\b(high|critical|urgent|important)\b/)) {
    if (!tags.includes('urgent')) tags.push('high-priority');
  }
  
  // Technology tags
  if (content.match(/\b(react|javascript|js|node)\b/)) tags.push('javascript');
  if (content.match(/\b(python|django|flask)\b/)) tags.push('python');
  if (content.match(/\b(java|spring)\b/)) tags.push('java');
  if (content.match(/\b(sql|database|mongodb|mysql)\b/)) tags.push('database');
  
  // Default tags if none found
  if (tags.length === 0) {
    tags.push('general');
    if (title.length < 20) tags.push('quick-task');
  }
  
  // Limit to 5 tags
  return tags.slice(0, 5);
};

const enhanceTaskWithAI = (taskData) => {
  const { title, description } = taskData;
  
  return {
    summary: taskData.summary || generateSummary(title, description || ''),
    tags: taskData.tags && taskData.tags.length > 0 
      ? taskData.tags 
      : generateTags(title, description || '')
  };
};

module.exports = {
  generateSummary,
  generateTags,
  enhanceTaskWithAI
};

