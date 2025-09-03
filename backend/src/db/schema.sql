-- SkillGraph Database Schema
-- PostgreSQL Database for Skills & Knowledge Graph

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(500),
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('admin', 'member', 'guest')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Teams table
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Team memberships
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, user_id)
);

-- Skills table
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
    description TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name)
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('planning', 'active', 'completed', 'archived')),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Graph edges for relationships
CREATE TABLE edges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID NOT NULL,
    target_id UUID NOT NULL,
    source_type VARCHAR(50) NOT NULL CHECK (source_type IN ('user', 'skill', 'project')),
    target_type VARCHAR(50) NOT NULL CHECK (target_type IN ('user', 'skill', 'project')),
    relationship_type VARCHAR(100) NOT NULL CHECK (relationship_type IN (
        'knows', 'wants_to_learn', 'teaching', 'requires', 'provides', 
        'collaborates_on', 'leads', 'participates_in', 'depends_on'
    )),
    strength DECIMAL(3,2) CHECK (strength BETWEEN 0.0 AND 1.0), -- confidence/proficiency level
    metadata JSONB, -- flexible data for relationship details
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Comments on nodes or edges
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- Either comment on an edge or a node (skill/project/user)
    edge_id UUID REFERENCES edges(id) ON DELETE CASCADE,
    node_id UUID,
    node_type VARCHAR(50) CHECK (node_type IN ('user', 'skill', 'project')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (edge_id IS NOT NULL AND node_id IS NULL AND node_type IS NULL) OR
        (edge_id IS NULL AND node_id IS NOT NULL AND node_type IS NOT NULL)
    )
);

-- Learning paths
CREATE TABLE learning_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_skill_id UUID NOT NULL REFERENCES skills(id),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Learning path steps
CREATE TABLE learning_path_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id),
    step_order INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(path_id, step_order)
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_edges_source ON edges(source_id, source_type);
CREATE INDEX idx_edges_target ON edges(target_id, target_type);
CREATE INDEX idx_edges_relationship ON edges(relationship_type);
CREATE INDEX idx_comments_edge_id ON comments(edge_id);
CREATE INDEX idx_comments_node ON comments(node_id, node_type);
CREATE INDEX idx_learning_paths_user_id ON learning_paths(user_id);
CREATE INDEX idx_learning_path_steps_path_id ON learning_path_steps(path_id);

-- Materialized view for team skill coverage
CREATE MATERIALIZED VIEW team_skill_coverage AS
SELECT 
    t.id as team_id,
    t.name as team_name,
    s.id as skill_id,
    s.name as skill_name,
    s.category,
    COUNT(DISTINCT e.source_id) as members_with_skill,
    AVG(e.strength) as avg_proficiency,
    COUNT(DISTINCT tm.user_id) as total_members
FROM teams t
LEFT JOIN team_members tm ON t.id = tm.team_id
LEFT JOIN edges e ON e.source_id = tm.user_id 
    AND e.source_type = 'user' 
    AND e.target_type = 'skill'
    AND e.relationship_type = 'knows'
LEFT JOIN skills s ON s.id = e.target_id
GROUP BY t.id, t.name, s.id, s.name, s.category;

-- Refresh function for materialized view
CREATE OR REPLACE FUNCTION refresh_team_skill_coverage()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW team_skill_coverage;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers to refresh materialized view
CREATE TRIGGER refresh_coverage_on_edge_change
    AFTER INSERT OR UPDATE OR DELETE ON edges
    FOR EACH STATEMENT EXECUTE FUNCTION refresh_team_skill_coverage();

CREATE TRIGGER refresh_coverage_on_team_member_change
    AFTER INSERT OR UPDATE OR DELETE ON team_members
    FOR EACH STATEMENT EXECUTE FUNCTION refresh_team_skill_coverage();

-- Function to find skill recommendations using recursive queries
CREATE OR REPLACE FUNCTION get_skill_recommendations(
    user_id_param UUID,
    max_depth INTEGER DEFAULT 3,
    limit_results INTEGER DEFAULT 10
)
RETURNS TABLE(
    skill_id UUID,
    skill_name VARCHAR(255),
    path_length INTEGER,
    recommendation_score DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE skill_graph AS (
        -- Base case: skills user already knows
        SELECT 
            e.target_id as skill_id,
            s.name as skill_name,
            0 as depth,
            e.strength as base_strength
        FROM edges e
        JOIN skills s ON s.id = e.target_id
        WHERE e.source_id = user_id_param 
            AND e.source_type = 'user'
            AND e.target_type = 'skill'
            AND e.relationship_type = 'knows'
        
        UNION ALL
        
        -- Recursive case: skills connected to known skills
        SELECT 
            e2.target_id as skill_id,
            s2.name as skill_name,
            sg.depth + 1,
            sg.base_strength * e2.strength as base_strength
        FROM skill_graph sg
        JOIN edges e2 ON e2.source_id = sg.skill_id
            AND e2.source_type = 'skill'
            AND e2.target_type = 'skill'
        JOIN skills s2 ON s2.id = e2.target_id
        WHERE sg.depth < max_depth
    ),
    recommendations AS (
        SELECT 
            sg.skill_id,
            sg.skill_name,
            MIN(sg.depth) as path_length,
            -- Calculate recommendation score based on path length and connection strength
            AVG(sg.base_strength) * EXP(-0.5 * MIN(sg.depth)) as recommendation_score
        FROM skill_graph sg
        WHERE sg.depth > 0  -- Exclude skills user already knows
            AND sg.skill_id NOT IN (
                -- Exclude skills user already knows
                SELECT e.target_id 
                FROM edges e 
                WHERE e.source_id = user_id_param 
                    AND e.source_type = 'user'
                    AND e.target_type = 'skill'
                    AND e.relationship_type = 'knows'
            )
        GROUP BY sg.skill_id, sg.skill_name
        ORDER BY recommendation_score DESC
        LIMIT limit_results
    )
    SELECT * FROM recommendations;
END;
$$ LANGUAGE plpgsql;
