import { Record, NormalizedData, PlainCollection } from '../../data/Contract'
import Model from '../../model/Model'
import Repo, { Relation as Load } from '../../repo/Repo'
import Relation from './Relation'

export type Entity = typeof Model | string

export default class HasManyThrough extends Relation {
  /**
   * The related model.
   */
  related: typeof Model

  /**
   * The "through" parent model.
   */
  through: typeof Model

  /**
   * The near key on the relationship.
   */
  firstKey: string

  /**
   * The far key on the relationship.
   */
  secondKey: string

  /**
   * The local key on the relationship.
   */
  localKey: string

  /**
   * The local key on the intermediary model.
   */
  secondLocalKey: string

  /**
   * Create a new has many through instance.
   */
  constructor (
    model: typeof Model,
    related: Entity,
    through: Entity,
    firstKey: string,
    secondKey: string,
    localKey: string,
    secondLocalKey: string
  ) {
    super(model)

    this.related = this.model.relation(related)
    this.through = this.model.relation(through)
    this.firstKey = firstKey
    this.secondKey = secondKey
    this.localKey = localKey
    this.secondLocalKey = secondLocalKey
  }

  /**
   * Transform given data to the appropriate value. This method will be called
   * during data normalization to fix field that has an incorrect value,
   * or add a missing field with the appropriate default value.
   */
  fill (value: any): (string | number | Record)[] {
    return Array.isArray(value) ? value : []
  }

  /**
   * Make value to be set to model property. This method is used when
   * instantiating a model or creating a plain object from a model.
   */
  make (value: any, _parent: Record, _key: string): Model[] {
    if (value === undefined) {
      return []
    }

    if (!Array.isArray(value)) {
      return []
    }

    if (value.length === 0) {
      return []
    }

    return value.filter((record) => {
      return record && typeof record === 'object'
    }).map((record) => {
      return new this.related(record)
    })
  }

  /**
   * Attach the relational key to the given record.
   */
  attach (_key: any, _record: Record, _data: NormalizedData): void {
    return
  }

  /**
   * Load the has many through relationship for the record.
   */
  load (repo: Repo, record: Record, relation: Load): PlainCollection {
    const throuthQuery = new Repo(repo.state, this.through.entity, false)

    const throughIds = throuthQuery.where(this.firstKey, record[this.localKey]).get().map(through => through[this.secondLocalKey])

    const relatedQuery = new Repo(repo.state, this.related.entity, false)

    relatedQuery.where(this.secondKey, (id: any) => throughIds.includes(id))

    this.addConstraint(relatedQuery, relation)

    return relatedQuery.get()
  }
}
