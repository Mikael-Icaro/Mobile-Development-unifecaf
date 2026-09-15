import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { fetchProductById } from '../services/api';
import { calculateFinalPrice, formatBRL } from '../services/format';

export default function ProductDetailScreen({ route }) {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCancelled = false;

    fetchProductById(productId)
      .then((data) => {
        if (!isCancelled) setProduct(data);
      })
      .catch(() => {
        if (!isCancelled) setError('Não foi possível carregar os detalhes do produto.');
      })
      .finally(() => {
        if (!isCancelled) setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [productId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2c3e50" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Produto não encontrado.'}</Text>
      </View>
    );
  }

  const finalPrice = calculateFinalPrice(product.price, product.discountPercentage);
  const hasDiscount = product.discountPercentage > 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: product.thumbnail }} style={styles.image} />
      <Text style={styles.title}>{product.title}</Text>

      <View style={styles.priceRow}>
        <Text style={styles.finalPrice}>{formatBRL(finalPrice)}</Text>
        {hasDiscount ? (
          <>
            <Text style={styles.originalPrice}>{formatBRL(product.price)}</Text>
            <Text style={styles.discount}>-{Math.round(product.discountPercentage)}%</Text>
          </>
        ) : null}
      </View>

      <Text style={styles.description}>{product.description}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    color: '#c0392b',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 260,
    borderRadius: 12,
    backgroundColor: '#f2f2f2',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginTop: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  finalPrice: {
    fontSize: 22,
    fontWeight: '700',
    color: '#c0392b',
  },
  originalPrice: {
    fontSize: 15,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  discount: {
    fontSize: 14,
    color: '#27ae60',
    fontWeight: '600',
  },
});
