"""Game mechanics: XP, levels, quests, and achievements."""

from .models import PlayerState, XPEvent, QuestUpdate

# Level thresholds and names
LEVELS = [
    (0, "Apprentice"),
    (100, "Journeyman"),
    (300, "Adept"),
    (600, "Mage"),
    (1000, "Archmage"),
    (1500, "Grand Sorcerer"),
]

# XP rewards for different actions
XP_REWARDS = {
    "ask_question": 10,
    "new_topic": 25,
    "deep_dive": 15,  # Follow-up question on same topic
    "quest_complete": 50,
    "first_question": 20,
}

# Available quests
QUESTS = {
    "compute_trials": {
        "name": "The Compute Trials",
        "description": "Learn about 3 different AWS compute services (EC2, Lambda, ECS/EKS)",
        "required_topics": ["ec2", "lambda", "ecs", "eks"],
        "required_count": 3,
        "xp_reward": 50,
    },
    "network_secrets": {
        "name": "Secrets of the Network",
        "description": "Explore VPC, subnets, and security groups",
        "required_topics": ["vpc", "subnet", "security_group"],
        "required_count": 3,
        "xp_reward": 50,
    },
    "storage_vault": {
        "name": "The Storage Vault",
        "description": "Discover S3, EBS, and EFS",
        "required_topics": ["s3", "ebs", "efs"],
        "required_count": 3,
        "xp_reward": 50,
    },
    "database_dungeon": {
        "name": "The Database Dungeon",
        "description": "Master RDS, DynamoDB, and ElastiCache",
        "required_topics": ["rds", "dynamodb", "elasticache"],
        "required_count": 3,
        "xp_reward": 50,
    },
    "security_ward": {
        "name": "The Security Ward",
        "description": "Understand IAM, KMS, and Secrets Manager",
        "required_topics": ["iam", "kms", "secrets_manager"],
        "required_count": 3,
        "xp_reward": 50,
    },
    "serverless_sanctum": {
        "name": "The Serverless Sanctum",
        "description": "Learn Lambda, API Gateway, and Step Functions",
        "required_topics": ["lambda", "api_gateway", "step_functions"],
        "required_count": 3,
        "xp_reward": 50,
    },
}

# Achievements
ACHIEVEMENTS = {
    "first_words": {
        "name": "First Words",
        "description": "Ask your first question to the wizard",
        "condition": lambda state: state.conversation_count >= 1,
    },
    "curious_mind": {
        "name": "Curious Mind",
        "description": "Explore 5 different topics",
        "condition": lambda state: len(state.topics_explored) >= 5,
    },
    "knowledge_seeker": {
        "name": "Knowledge Seeker",
        "description": "Explore 10 different topics",
        "condition": lambda state: len(state.topics_explored) >= 10,
    },
    "quest_starter": {
        "name": "Quest Starter",
        "description": "Complete your first quest",
        "condition": lambda state: len(state.quests_completed) >= 1,
    },
    "quest_master": {
        "name": "Quest Master",
        "description": "Complete 3 quests",
        "condition": lambda state: len(state.quests_completed) >= 3,
    },
    "level_up": {
        "name": "Level Up!",
        "description": "Reach Journeyman level",
        "condition": lambda state: state.level >= 2,
    },
    "adept_scholar": {
        "name": "Adept Scholar",
        "description": "Reach Adept level",
        "condition": lambda state: state.level >= 3,
    },
    "marathon_learner": {
        "name": "Marathon Learner",
        "description": "Ask 25 questions",
        "condition": lambda state: state.conversation_count >= 25,
    },
}

# Topic detection keywords
TOPIC_KEYWORDS = {
    "ec2": ["ec2", "instance", "virtual machine", "ami"],
    "lambda": ["lambda", "serverless function", "function as a service"],
    "s3": ["s3", "bucket", "object storage", "simple storage"],
    "vpc": ["vpc", "virtual private cloud", "network"],
    "iam": ["iam", "identity", "access management", "role", "policy", "permission"],
    "rds": ["rds", "relational database", "aurora", "mysql", "postgres"],
    "dynamodb": ["dynamodb", "nosql", "dynamo"],
    "ecs": ["ecs", "container service", "fargate"],
    "eks": ["eks", "kubernetes", "k8s"],
    "cloudformation": ["cloudformation", "cfn", "infrastructure as code"],
    "api_gateway": ["api gateway", "apigateway", "rest api"],
    "step_functions": ["step functions", "state machine", "workflow"],
    "sns": ["sns", "notification", "pub/sub"],
    "sqs": ["sqs", "queue", "message queue"],
    "kms": ["kms", "key management", "encryption key"],
    "secrets_manager": ["secrets manager", "secret", "credential storage"],
    "cloudwatch": ["cloudwatch", "monitoring", "logs", "metrics"],
    "ebs": ["ebs", "block storage", "volume"],
    "efs": ["efs", "file system", "elastic file"],
    "elasticache": ["elasticache", "redis", "memcached", "cache"],
    "subnet": ["subnet", "availability zone", "cidr"],
    "security_group": ["security group", "firewall", "inbound", "outbound"],
    "route53": ["route 53", "route53", "dns", "domain name"],
    "cloudfront": ["cloudfront", "cdn", "content delivery"],
}


def detect_topics(message: str) -> list[str]:
    """Detect AWS topics mentioned in a message."""
    message_lower = message.lower()
    detected = []
    for topic, keywords in TOPIC_KEYWORDS.items():
        if any(kw in message_lower for kw in keywords):
            detected.append(topic)
    return detected


def calculate_level(xp: int) -> tuple[int, str]:
    """Calculate level and level name from XP."""
    level = 1
    level_name = "Apprentice"
    for i, (threshold, name) in enumerate(LEVELS):
        if xp >= threshold:
            level = i + 1
            level_name = name
    return level, level_name


def process_game_turn(
    player_state: PlayerState, message: str
) -> tuple[PlayerState, list[XPEvent], list[QuestUpdate], list[str]]:
    """
    Process a game turn: award XP, check quests, grant achievements.

    Returns updated player state, XP events, quest updates, and new achievements.
    """
    xp_events: list[XPEvent] = []
    quest_updates: list[QuestUpdate] = []
    new_achievements: list[str] = []

    # Increment conversation count
    player_state.conversation_count += 1

    # Award base XP for asking a question
    xp_events.append(XPEvent(reason="Asked the wizard a question", amount=XP_REWARDS["ask_question"]))
    player_state.xp += XP_REWARDS["ask_question"]

    # First question bonus
    if player_state.conversation_count == 1:
        xp_events.append(XPEvent(reason="First question bonus!", amount=XP_REWARDS["first_question"]))
        player_state.xp += XP_REWARDS["first_question"]

    # Detect topics and award XP for new ones
    detected_topics = detect_topics(message)
    for topic in detected_topics:
        if topic not in player_state.topics_explored:
            player_state.topics_explored.append(topic)
            xp_events.append(
                XPEvent(reason=f"Discovered new topic: {topic}", amount=XP_REWARDS["new_topic"])
            )
            player_state.xp += XP_REWARDS["new_topic"]

            # Check quest progress
            for quest_id, quest in QUESTS.items():
                if quest_id in player_state.quests_completed:
                    continue

                matching_topics = [
                    t for t in player_state.topics_explored if t in quest["required_topics"]
                ]

                # Start quest if first matching topic
                if len(matching_topics) == 1 and quest_id not in player_state.quests_active:
                    player_state.quests_active.append(quest_id)
                    quest_updates.append(
                        QuestUpdate(
                            quest_id=quest_id,
                            quest_name=quest["name"],
                            progress="started",
                            description=quest["description"],
                        )
                    )

                # Complete quest if enough topics covered
                if len(matching_topics) >= quest["required_count"]:
                    if quest_id in player_state.quests_active:
                        player_state.quests_active.remove(quest_id)
                    player_state.quests_completed.append(quest_id)
                    player_state.xp += quest["xp_reward"]
                    xp_events.append(
                        XPEvent(
                            reason=f"Quest complete: {quest['name']}",
                            amount=quest["xp_reward"],
                        )
                    )
                    quest_updates.append(
                        QuestUpdate(
                            quest_id=quest_id,
                            quest_name=quest["name"],
                            progress="completed",
                            description=quest["description"],
                        )
                    )
        else:
            # Deep dive XP for revisiting a topic
            xp_events.append(
                XPEvent(reason=f"Deep dive: {topic}", amount=XP_REWARDS["deep_dive"])
            )
            player_state.xp += XP_REWARDS["deep_dive"]

    # Update level
    new_level, new_level_name = calculate_level(player_state.xp)
    if new_level > player_state.level:
        player_state.level = new_level
        player_state.level_name = new_level_name

    # Check achievements
    for achievement_id, achievement in ACHIEVEMENTS.items():
        if achievement_id not in player_state.achievements:
            if achievement["condition"](player_state):
                player_state.achievements.append(achievement_id)
                new_achievements.append(achievement["name"])

    return player_state, xp_events, quest_updates, new_achievements
