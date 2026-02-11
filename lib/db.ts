import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb'
import { awsCredentialsProvider } from '@vercel/functions/oidc'
import { GraphicsCard } from './types'

export const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME
const PK = process.env.DYNAMODB_TABLE_PARTITION_KEY || 'id'

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: awsCredentialsProvider({
    roleArn: process.env.AWS_ROLE_ARN,
    clientConfig: { region: process.env.AWS_REGION },
  }),
})

const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
})

export async function getAllCards(): Promise<GraphicsCard[]> {
  const result = await docClient.send(
    new ScanCommand({
      TableName: TABLE_NAME,
    }),
  )

  const cards = (result.Items || []) as GraphicsCard[]
  return cards.sort((a, b) => b.createdAt - a.createdAt)
}

export async function getCardById(id: string): Promise<GraphicsCard | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { [PK]: id },
    }),
  )

  return (result.Item as GraphicsCard) || null
}

export async function createCard(card: Omit<GraphicsCard, 'createdAt' | 'updatedAt'>): Promise<GraphicsCard> {
  const now = Date.now()
  const fullCard: GraphicsCard = {
    ...card,
    createdAt: now,
    updatedAt: now,
  }

  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: { [PK]: card.id, ...fullCard },
    }),
  )

  return fullCard
}

export async function updateCard(
  id: string,
  updates: Partial<Omit<GraphicsCard, 'id' | 'createdAt'>>,
): Promise<GraphicsCard | null> {
  const expressionParts: string[] = []
  const expressionAttributeNames: Record<string, string> = {}
  const expressionAttributeValues: Record<string, any> = {}

  const updateableFields = ['name', 'price', 'state', 'description', 'specs', 'images']

  for (const field of updateableFields) {
    if (field in updates) {
      expressionParts.push(`#${field} = :${field}`)
      expressionAttributeNames[`#${field}`] = field
      expressionAttributeValues[`:${field}`] = updates[field as keyof typeof updates]
    }
  }

  expressionParts.push('#updated = :updated')
  expressionAttributeNames['#updated'] = 'updatedAt'
  expressionAttributeValues[':updated'] = Date.now()

  if (expressionParts.length === 0) {
    return getCardById(id)
  }

  const result = await docClient.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { [PK]: id },
      UpdateExpression: `SET ${expressionParts.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    }),
  )

  return (result.Attributes as GraphicsCard) || null
}

export async function deleteCard(id: string): Promise<boolean> {
  await docClient.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { [PK]: id },
    }),
  )

  return true
}
