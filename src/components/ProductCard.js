import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { calculateFinalPrice, formatBRL } from '../services/format';

export default function ProductCard({ product, onPress }) {
  const finalPrice = calculateFinalPrice(product.price, product.discountPercentage);
  const hasDiscount = product.discountPercentage > 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: product.thumbnail }} style={styles.thumbnail} />
      <Text style={styles.title} numberOfLines={1}>
        {product.title}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {product.description}
      </Text>
      <View style={styles.priceRow}>
        <Text style={styles.finalPrice}>{formatBRL(finalPrice)}</Text>
        {hasDiscount ? (
          <Text style={styles.originalPrice}>{formatBRL(product.price)}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  thumbnail: {
    width: '100%',
    height: 110,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    fontSize: 11,
    color: '#888',
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  finalPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#c0392b',
  },
  originalPrice: {
    fontSize: 11,
    color: '#999',
    textDecorationLine: 'line-through',
  },
});
