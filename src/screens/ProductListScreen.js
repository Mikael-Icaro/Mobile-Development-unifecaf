import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import ProductCard from '../components/ProductCard';
import {
  FEMALE_CATEGORIES,
  MALE_CATEGORIES,
  fetchProductsByCategories,
} from '../services/api';
import { logout } from '../store/authSlice';

const TABS = [
  { key: 'male', label: 'Produtos Masculinos', categories: MALE_CATEGORIES },
  { key: 'female', label: 'Produtos Femininos', categories: FEMALE_CATEGORIES },
];

export default function ProductListScreen({ navigation }) {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('male');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCancelled = false;
    const tab = TABS.find((t) => t.key === activeTab);

    setLoading(true);
    setError('');

    fetchProductsByCategories(tab.categories)
      .then((data) => {
        if (!isCancelled) setProducts(data);
      })
      .catch(() => {
        if (!isCancelled) setError('Não foi possível carregar os produtos. Tente novamente.');
      })
      .finally(() => {
        if (!isCancelled) setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [activeTab]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabButton, activeTab === tab.key && styles.tabButtonActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2f6fed" />
        </View>
      )}

      {!loading && error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {!loading && !error && (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text>Nenhum produto encontrado.</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={() => dispatch(logout())}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#2f6fed',
  },
  tabLabel: {
    fontSize: 13,
    color: '#999',
  },
  tabLabelActive: {
    color: '#2f6fed',
    fontWeight: '700',
  },
  listContent: {
    padding: 6,
    paddingBottom: 16,
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
  logoutButton: {
    backgroundColor: '#e74c3c',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
