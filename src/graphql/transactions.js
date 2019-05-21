import gql from 'graphql-tag';

export const TRANSACTION_LIST_QUERY = gql`
query transactions ($filter: TransactionKind,  $page: Int, $perPage: Int) {
  transactions (filter: $filter, page: $page, perPage: $perPage) {
    collection {
      id
      customerId
      createdAt
      amount
      comment
      status
      currencyCode
      updatedAt
      mode
      }
    pagination {
      count
          items
          page
          pages
          offset
          last
          next
          prev
          from
          to
    }
  }
}
`
