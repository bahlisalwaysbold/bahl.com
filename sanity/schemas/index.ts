export const division = {
  name: 'division', type: 'document', title: 'Division',
  fields: [
    { name: 'title', type: 'string', title: 'Title' },
    { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title' } },
    { name: 'shortDescription', type: 'text', title: 'Short description' },
    { name: 'description', type: 'array', title: 'Description', of: [{ type: 'block' }] },
    { name: 'accent', type: 'string', title: 'Accent color' },
    { name: 'active', type: 'boolean', title: 'Live at launch', initialValue: true },
    { name: 'services', type: 'array', title: 'Services', of: [{ type: 'reference', to: [{ type: 'service' }] }] },
  ]
};

export const service = {
  name: 'service', type: 'document', title: 'Service',
  fields: [
    { name: 'title', type: 'string', title: 'Title' },
    { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title' } },
    { name: 'description', type: 'text', title: 'Description' },
    { name: 'division', type: 'reference', to: [{ type: 'division' }] },
  ]
};

export const project = {
  name: 'project', type: 'document', title: 'Project',
  fields: [
    { name: 'title', type: 'string', title: 'Project title' },
    { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title' } },
    { name: 'division', type: 'reference', to: [{ type: 'division' }] },
    { name: 'projectType', type: 'string', title: 'Project type' },
    { name: 'year', type: 'number', title: 'Year' },
    { name: 'location', type: 'string', title: 'Location' },
    { name: 'scope', type: 'text', title: 'Scope' },
    { name: 'problem', type: 'text', title: 'Problem' },
    { name: 'solution', type: 'text', title: 'Solution' },
    { name: 'outcome', type: 'text', title: 'Outcome' },
    { name: 'coverImage', type: 'image', title: 'Cover image', options: { hotspot: true } },
    { name: 'beforeImage', type: 'image', title: 'Before image', options: { hotspot: true } },
    { name: 'afterImage', type: 'image', title: 'After image', options: { hotspot: true } },
    { name: 'drawings', type: 'array', title: 'Drawings / renders', of: [{ type: 'image' }] },
    { name: 'featured', type: 'boolean', title: 'Featured' },
  ]
};

export const testimonial = {
  name: 'testimonial', type: 'document', title: 'Testimonial',
  fields: [
    { name: 'quote', type: 'text', title: 'Quote' },
    { name: 'name', type: 'string', title: 'Name' },
    { name: 'company', type: 'string', title: 'Company' },
  ]
};

export const article = {
  name: 'article', type: 'document', title: 'Article',
  fields: [
    { name: 'title', type: 'string', title: 'Title' },
    { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title' } },
    { name: 'excerpt', type: 'text', title: 'Excerpt' },
    { name: 'publishedAt', type: 'datetime', title: 'Published at' },
    { name: 'body', type: 'array', title: 'Body', of: [{ type: 'block' }] },
  ]
};

export const teamMember = {
  name: 'teamMember', type: 'document', title: 'Team member',
  fields: [
    { name: 'name', type: 'string', title: 'Name' },
    { name: 'role', type: 'string', title: 'Role' },
    { name: 'bio', type: 'text', title: 'Bio' },
    { name: 'image', type: 'image', title: 'Image', options: { hotspot: true } },
  ]
};

export const schemaTypes = [division, service, project, testimonial, article, teamMember];
